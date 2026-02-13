/**
 * Test script to verify form security features
 * Run with: npx tsx scripts/test-form-security.ts
 */

import {
  isRateLimited,
  validateHoneypot,
  validateFormTiming,
  validateFormToken,
  generateFormToken,
  sanitizeInput,
  hasSpamPatterns,
  validateFormSubmission,
} from "../lib/form-security";

console.log("\n🔒 FORM SECURITY TEST\n");
console.log("=".repeat(50));

// Test 1: Rate Limiting
console.log("\n📊 TEST 1: Rate Limiting");
console.log("-".repeat(30));
const testIP = "192.168.1.100";
let blocked = false;
for (let i = 1; i <= 5; i++) {
  const isBlocked = isRateLimited(testIP);
  console.log(`  Submission #${i}: ${isBlocked ? "❌ BLOCKED" : "✅ Allowed"}`);
  if (isBlocked) blocked = true;
}
console.log(`  Result: ${blocked ? "✅ PASS - Rate limiting works!" : "❌ FAIL"}`);

// Test 2: Honeypot
console.log("\n🍯 TEST 2: Honeypot Field");
console.log("-".repeat(30));
const emptyHoneypot = validateHoneypot("");
const filledHoneypot = validateHoneypot("spam-bot-filled-this");
console.log(`  Empty honeypot (human): ${emptyHoneypot ? "✅ Allowed" : "❌ Blocked"}`);
console.log(`  Filled honeypot (bot): ${filledHoneypot ? "❌ Allowed" : "✅ BLOCKED"}`);
console.log(`  Result: ${emptyHoneypot && !filledHoneypot ? "✅ PASS - Honeypot works!" : "❌ FAIL"}`);

// Test 3: Form Timing
console.log("\n⏱️  TEST 3: Form Timing (3 second minimum)");
console.log("-".repeat(30));
const now = Date.now();
const instantSubmit = validateFormTiming(now, 3); // Submit immediately
const normalSubmit = validateFormTiming(now - 5000, 3); // Submit after 5 seconds
console.log(`  Instant submit (bot): ${instantSubmit ? "❌ Allowed" : "✅ BLOCKED"}`);
console.log(`  5-second submit (human): ${normalSubmit ? "✅ Allowed" : "❌ Blocked"}`);
console.log(`  Result: ${!instantSubmit && normalSubmit ? "✅ PASS - Timing validation works!" : "❌ FAIL"}`);

// Test 4: Form Token
console.log("\n🎫 TEST 4: Form Token Validation");
console.log("-".repeat(30));
const validToken = generateFormToken();
const invalidToken = "invalid-token";
const expiredToken = "1-abcdefgh"; // Very old timestamp
console.log(`  Valid token: ${validateFormToken(validToken) ? "✅ Allowed" : "❌ Blocked"}`);
console.log(`  Invalid token: ${validateFormToken(invalidToken) ? "❌ Allowed" : "✅ BLOCKED"}`);
console.log(`  Expired token: ${validateFormToken(expiredToken) ? "❌ Allowed" : "✅ BLOCKED"}`);
console.log(`  Result: ${validateFormToken(validToken) && !validateFormToken(invalidToken) ? "✅ PASS - Token validation works!" : "❌ FAIL"}`);

// Test 5: Input Sanitization
console.log("\n🧹 TEST 5: Input Sanitization (XSS Prevention)");
console.log("-".repeat(30));
const xssAttempt = '<script>alert("hacked")</script>';
const sqlAttempt = "'; DROP TABLE users; --";
const normalInput = "Hello, I'm interested in your services.";
console.log(`  XSS attempt: "${xssAttempt}"`);
console.log(`  Sanitized:   "${sanitizeInput(xssAttempt)}"`);
console.log(`  SQL attempt: "${sqlAttempt}"`);
console.log(`  Sanitized:   "${sanitizeInput(sqlAttempt)}"`);
console.log(`  Normal text preserved: ${sanitizeInput(normalInput).includes("interested") ? "✅ Yes" : "❌ No"}`);
console.log(`  Result: ${!sanitizeInput(xssAttempt).includes("<script>") ? "✅ PASS - XSS blocked!" : "❌ FAIL"}`);

// Test 6: Spam Detection
console.log("\n🚫 TEST 6: Spam Pattern Detection");
console.log("-".repeat(30));
const spamMessages = [
  "Click here to claim your $1000 prize!",
  "Visit http://bit.ly/spam for free viagra",
  "Congratulations! You won the lottery!",
  "[url=http://spam.com]Click here[/url]",
];
const normalMessages = [
  "I would like to inquire about your services.",
  "Please contact me regarding the property.",
  "My name is John and I'm interested in collaboration.",
];

console.log("  Spam messages:");
spamMessages.forEach((msg) => {
  const isSpam = hasSpamPatterns(msg);
  console.log(`    "${msg.substring(0, 40)}..." ${isSpam ? "✅ BLOCKED" : "❌ Allowed"}`);
});

console.log("  Normal messages:");
normalMessages.forEach((msg) => {
  const isSpam = hasSpamPatterns(msg);
  console.log(`    "${msg.substring(0, 40)}..." ${isSpam ? "❌ Blocked" : "✅ Allowed"}`);
});

// Test 7: Full Validation
console.log("\n🔐 TEST 7: Full Form Submission Validation");
console.log("-".repeat(30));

// Legitimate submission
const legitimateResult = validateFormSubmission({
  ip: "10.0.0.1",
  honeypot: "",
  formToken: generateFormToken(),
  formStartTime: Date.now() - 10000, // 10 seconds ago
  fields: { name: "John Doe", email: "john@example.com", message: "Hello!" },
});
console.log(`  Legitimate submission: ${legitimateResult.valid ? "✅ Allowed" : `❌ Blocked (${legitimateResult.code})`}`);

// Bot submission (honeypot filled)
const botResult = validateFormSubmission({
  ip: "10.0.0.2",
  honeypot: "bot-filled-this",
  formToken: generateFormToken(),
  formStartTime: Date.now() - 10000,
  fields: { name: "Bot", email: "bot@spam.com" },
});
console.log(`  Bot submission (honeypot): ${botResult.valid ? "❌ Allowed" : `✅ BLOCKED (${botResult.code})`}`);

// Spam submission
const spamResult = validateFormSubmission({
  ip: "10.0.0.3",
  honeypot: "",
  formToken: generateFormToken(),
  formStartTime: Date.now() - 10000,
  fields: { name: "Spammer", message: "Click here to claim $5000 USD prize!" },
});
console.log(`  Spam submission: ${spamResult.valid ? "❌ Allowed" : `✅ BLOCKED (${spamResult.code})`}`);

// Too fast submission
const fastResult = validateFormSubmission({
  ip: "10.0.0.4",
  honeypot: "",
  formToken: generateFormToken(),
  formStartTime: Date.now(), // Just now (too fast)
  fields: { name: "Fast Bot", email: "fast@bot.com" },
});
console.log(`  Too fast submission: ${fastResult.valid ? "❌ Allowed" : `✅ BLOCKED (${fastResult.code})`}`);

console.log("\n" + "=".repeat(50));
console.log("🎉 SECURITY TEST COMPLETE\n");
