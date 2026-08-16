// test.js
import dns from "dns/promises";

try {
  const records = await dns.resolveSrv(
    "_mongodb._tcp.documindai.hw5suvj.mongodb.net"
  );

  console.log(records);
} catch (err) {
  console.error(err);
}