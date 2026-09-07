import { Router } from "express";
import dns from "dns";
import tls from "tls";
import net from "net";

export const networkRouter = Router();

// 1. My Public IP & Connection Info
networkRouter.get("/myip", (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" 
    ? forwarded.split(",")[0].trim() 
    : req.socket.remoteAddress || "127.0.0.1";
  
  res.json({
    ip: clientIp,
    userAgent: req.headers["user-agent"] || "",
    acceptLanguage: req.headers["accept-language"] || "",
    protocol: req.protocol,
    timestamp: new Date().toISOString(),
  });
});

// 2. DNS Lookup
networkRouter.post("/dns", async (req, res) => {
  try {
    const { domain, type = "ANY" } = req.body;
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({ error: "Domain name is required" });
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
    const dnsPromises = dns.promises;
    const results: Record<string, any> = {};

    const fetchRecord = async (recType: string) => {
      try {
        switch (recType) {
          case "A":
            return await dnsPromises.resolve4(cleanDomain, { ttl: true });
          case "AAAA":
            return await dnsPromises.resolve6(cleanDomain, { ttl: true });
          case "MX":
            return await dnsPromises.resolveMx(cleanDomain);
          case "TXT":
            return await dnsPromises.resolveTxt(cleanDomain);
          case "NS":
            return await dnsPromises.resolveNs(cleanDomain);
          case "CNAME":
            return await dnsPromises.resolveCname(cleanDomain);
          case "SOA":
            return await dnsPromises.resolveSoa(cleanDomain);
          case "CAA":
            return await dnsPromises.resolveCaa(cleanDomain);
          default:
            return null;
        }
      } catch {
        return null;
      }
    };

    if (type === "ANY" || type === "ALL") {
      const [a, aaaa, mx, txt, ns, cname, soa, caa] = await Promise.all([
        fetchRecord("A"),
        fetchRecord("AAAA"),
        fetchRecord("MX"),
        fetchRecord("TXT"),
        fetchRecord("NS"),
        fetchRecord("CNAME"),
        fetchRecord("SOA"),
        fetchRecord("CAA"),
      ]);

      if (a) results.A = a;
      if (aaaa) results.AAAA = aaaa;
      if (mx) results.MX = mx;
      if (txt) results.TXT = txt;
      if (ns) results.NS = ns;
      if (cname) results.CNAME = cname;
      if (soa) results.SOA = soa;
      if (caa) results.CAA = caa;
    } else {
      const rec = await fetchRecord(type.toUpperCase());
      if (rec) results[type.toUpperCase()] = rec;
    }

    res.json({
      domain: cleanDomain,
      queryType: type,
      timestamp: new Date().toISOString(),
      records: results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to resolve DNS" });
  }
});

// 3. WHOIS / RDAP Lookup
networkRouter.post("/whois", async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({ error: "Domain or IP is required" });
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
    
    // Fetch RDAP (Registration Data Access Protocol)
    const isIp = net.isIP(cleanDomain);
    const rdapUrl = isIp 
      ? `https://rdap.org/ip/${cleanDomain}`
      : `https://rdap.org/domain/${cleanDomain}`;

    const response = await fetch(rdapUrl, {
      headers: { Accept: "application/rdap+json, application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      let ipAddresses: string[] = [];
      try {
        ipAddresses = await dns.promises.resolve4(cleanDomain);
      } catch {}

      return res.json({
        domain: cleanDomain,
        handle: cleanDomain.toUpperCase(),
        status: ["active / resolved"],
        registrar: "Queried via RDAP Directory",
        nameServers: [],
        ips: ipAddresses,
        raw: { message: `RDAP server returned status ${response.status}`, domain: cleanDomain },
      });
    }

    const data = await response.json();
    
    const events = data.events || [];
    const createdEvent = events.find((e: any) => e.eventAction === "registration");
    const updatedEvent = events.find((e: any) => e.eventAction === "last changed" || e.eventAction === "last update");
    const expirationEvent = events.find((e: any) => e.eventAction === "expiration");

    const registrarEntity = (data.entities || []).find((ent: any) =>
      (ent.roles || []).includes("registrar")
    );
    const registrarName = registrarEntity?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3] ||
      registrarEntity?.handle || "Unknown Registrar";

    const nameServers = (data.nameservers || []).map((ns: any) => ns.ldhName || ns.handle || "").filter(Boolean);

    res.json({
      domain: cleanDomain,
      handle: data.handle || cleanDomain,
      status: data.status || ["active"],
      registrar: registrarName,
      created: createdEvent?.eventDate || null,
      updated: updatedEvent?.eventDate || null,
      expires: expirationEvent?.eventDate || null,
      nameServers,
      raw: data,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to query WHOIS/RDAP" });
  }
});

// 4. Ping & Latency Tester
networkRouter.post("/ping", async (req, res) => {
  try {
    const { host, port = 443 } = req.body;
    if (!host || typeof host !== "string") {
      return res.status(400).json({ error: "Host is required" });
    }

    const cleanHost = host.trim().replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
    const targetPort = Number(port) || 443;
    const pings: { seq: number; timeMs: number; status: "success" | "timeout" | "error" }[] = [];

    for (let i = 1; i <= 3; i++) {
      const startTime = performance.now();
      await new Promise<void>((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2500);

        socket.connect(targetPort, cleanHost, () => {
          const duration = Math.round((performance.now() - startTime) * 100) / 100;
          pings.push({ seq: i, timeMs: duration, status: "success" });
          socket.destroy();
          resolve();
        });

        socket.on("error", () => {
          pings.push({ seq: i, timeMs: 0, status: "error" });
          socket.destroy();
          resolve();
        });

        socket.on("timeout", () => {
          pings.push({ seq: i, timeMs: 2500, status: "timeout" });
          socket.destroy();
          resolve();
        });
      });
      await new Promise((r) => setTimeout(r, 60));
    }

    const successfulPings = pings.filter((p) => p.status === "success");
    const avgTime = successfulPings.length > 0
      ? Math.round((successfulPings.reduce((acc, p) => acc + p.timeMs, 0) / successfulPings.length) * 100) / 100
      : null;
    const minTime = successfulPings.length > 0 ? Math.min(...successfulPings.map((p) => p.timeMs)) : null;
    const maxTime = successfulPings.length > 0 ? Math.max(...successfulPings.map((p) => p.timeMs)) : null;

    res.json({
      host: cleanHost,
      port: targetPort,
      pings,
      avgTime,
      minTime,
      maxTime,
      lossPercent: Math.round(((pings.length - successfulPings.length) / pings.length) * 100),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to execute ping" });
  }
});

// 5. SSL/TLS Certificate Checker
networkRouter.post("/ssl", (req, res) => {
  const { host, port = 443 } = req.body;
  if (!host || typeof host !== "string") {
    return res.status(400).json({ error: "Host is required" });
  }

  const cleanHost = host.trim().replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
  const targetPort = Number(port) || 443;

  const socket = tls.connect(
    {
      host: cleanHost,
      port: targetPort,
      servername: cleanHost,
      timeout: 5000,
      rejectUnauthorized: false,
    },
    () => {
      const cert = socket.getPeerCertificate(true);
      const cipher = socket.getCipher();
      const protocol = socket.getProtocol();
      const authorized = socket.authorized;
      const authError = socket.authorizationError;

      socket.end();

      if (!cert || Object.keys(cert).length === 0) {
        return res.status(404).json({ error: "No SSL certificate found on host" });
      }

      const validFrom = cert.valid_from ? new Date(cert.valid_from).toISOString() : null;
      const validTo = cert.valid_to ? new Date(cert.valid_to).toISOString() : null;
      const now = new Date().getTime();
      const expires = validTo ? new Date(validTo).getTime() : 0;
      const daysRemaining = expires > now ? Math.round((expires - now) / (1000 * 60 * 60 * 24)) : 0;

      res.json({
        host: cleanHost,
        port: targetPort,
        valid: authorized,
        authError: authError || null,
        protocol,
        cipher,
        subject: cert.subject,
        issuer: cert.issuer,
        validFrom,
        validTo,
        daysRemaining,
        isExpired: daysRemaining <= 0,
        sans: cert.subjectaltname ? cert.subjectaltname.split(", ").map((s) => s.replace("DNS:", "")) : [],
        fingerprint: cert.fingerprint,
        fingerprint256: cert.fingerprint256,
        serialNumber: cert.serialNumber,
      });
    }
  );

  socket.on("error", (err) => {
    res.status(500).json({ error: `TLS connection failed: ${err.message}` });
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.status(408).json({ error: "SSL check timed out after 5 seconds" });
  });
});

// 6. HTTP Header & Security Inspector
networkRouter.post("/headers", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    const startTime = performance.now();
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DMLabTools/2.0",
      },
    });
    const ttfb = Math.round(performance.now() - startTime);

    const headers: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const securityCheck = {
      hsts: Boolean(headers["strict-transport-security"]),
      csp: Boolean(headers["content-security-policy"]),
      xFrameOptions: headers["x-frame-options"] || null,
      xContentTypeOptions: headers["x-content-type-options"] || null,
      referrerPolicy: headers["referrer-policy"] || null,
      permissionsPolicy: headers["permissions-policy"] || null,
    };

    res.json({
      url: targetUrl,
      status: response.status,
      statusText: response.statusText,
      ttfbMs: ttfb,
      httpVersion: response.type,
      headers,
      security: securityCheck,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to inspect HTTP headers" });
  }
});
