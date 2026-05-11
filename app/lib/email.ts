import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Bóthar <noreply@bothar.ie>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function isConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendSeatRequestEmail({
  driverEmail,
  passengerEmail,
  rideFrom,
  rideTo,
  rideDate,
  rideTime,
  message,
}: {
  driverEmail: string;
  passengerEmail: string;
  rideFrom: string;
  rideTo: string;
  rideDate: string;
  rideTime: string;
  message?: string;
}) {
  if (!isConfigured()) return;
  await getResend().emails.send({
    from: FROM,
    to: driverEmail,
    subject: `New seat request for your ride: ${rideFrom} → ${rideTo}`,
    html: `
      <p>Hi,</p>
      <p>A passenger has requested a seat on your ride.</p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:480px">
        <tr><td><strong>Route</strong></td><td>${rideFrom} → ${rideTo}</td></tr>
        <tr><td><strong>Date</strong></td><td>${rideDate} at ${rideTime}</td></tr>
        <tr><td><strong>Passenger</strong></td><td>${passengerEmail}</td></tr>
        ${message ? `<tr><td><strong>Message</strong></td><td>${message}</td></tr>` : ""}
      </table>
      <p>Log in to <a href="https://bothar.ie/rides">Manage Rides</a> to accept or decline.</p>
      <p>— The Bóthar team</p>
    `,
  });
}

export async function sendRequestDecisionEmail({
  passengerEmail,
  status,
  rideFrom,
  rideTo,
  rideDate,
  rideTime,
}: {
  passengerEmail: string;
  status: "accepted" | "declined";
  rideFrom: string;
  rideTo: string;
  rideDate: string;
  rideTime: string;
}) {
  if (!isConfigured()) return;

  const accepted = status === "accepted";

  await getResend().emails.send({
    from: FROM,
    to: passengerEmail,
    subject: accepted
      ? `Your seat request was accepted: ${rideFrom} → ${rideTo}`
      : `Update on your seat request: ${rideFrom} → ${rideTo}`,
    html: accepted
      ? `
        <p>Hi,</p>
        <p>Great news — the driver has <strong>accepted</strong> your seat request.</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:480px">
          <tr><td><strong>Route</strong></td><td>${rideFrom} → ${rideTo}</td></tr>
          <tr><td><strong>Date</strong></td><td>${rideDate} at ${rideTime}</td></tr>
        </table>
        <p>The driver will be in touch to confirm pick-up details.</p>
        <p>— The Bóthar team</p>
      `
      : `
        <p>Hi,</p>
        <p>Unfortunately the driver was unable to accommodate your request for this ride.</p>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:480px">
          <tr><td><strong>Route</strong></td><td>${rideFrom} → ${rideTo}</td></tr>
          <tr><td><strong>Date</strong></td><td>${rideDate} at ${rideTime}</td></tr>
        </table>
        <p>You can browse other available rides at <a href="https://bothar.ie/feed">bothar.ie/feed</a>.</p>
        <p>— The Bóthar team</p>
      `,
  });
}
