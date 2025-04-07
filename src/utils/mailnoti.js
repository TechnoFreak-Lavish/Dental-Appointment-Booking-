const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APPPASS,
  },
});

const getStyledTemplate = (title, greeting, contentHtml) => {
  return `
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: rgb(231, 204, 124);
        padding: 20px;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: rgb(255, 255, 255);
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
        padding: 30px;
      }
      .email-header {
        font-size: 22px;
        color: rgb(70, 124, 177);
        margin-bottom: 20px;
      }
      .email-details {
        font-size: 16px;
        line-height: 1.6;
      }
      .email-details ul {
        list-style: none;
        padding: 0;
      }
      .email-details li {
        margin-bottom: 10px;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 13px;
        color: #999;
      }
      .logo {
        margin-top: 10px;
        width: 120px;
        opacity: 0.8;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">${title}</div>
      <p>${greeting}</p>
      <div class="email-details">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>Thank you for choosing Dental Care!</p>
        <img class="logo" src="https://marketplace.canva.com/EAFzZ7HIqYo/1/0/1600w/canva-blue-and-white-minimal-dental-care-logo-D-_h-rJgSAk.jpg" alt="Clinic Logo" />
        <p>&copy; ${new Date().getFullYear()} Dental Care. All rights reserved.</p>
      </div>
    </div>
  </body>
  `;
};
// welcome mail
const sendWelcomeEmail = async ({ name, email }) => {
    const html = getStyledTemplate(
      "Welcome to Dental Care!",
      `Hi <strong>${name}</strong>,`,
      `
        <p>Welcome aboard! We're excited to have you as a new patient at Dental Care.</p>
        <p>You can now book appointments, view your appointment history, and manage your visits online.</p>
        <p>If you ever need help, we're just an email away.</p>
      `
    );
  
    await transporter.sendMail({
      from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Dental Care!",
      html,
    });
  };
//  Appointment Confirmation
const sendStyledAppointmentEmail = async ({ name, email, date, slot, clinic, reason }) => {
  const html = getStyledTemplate(
    "Appointment Confirmation",
    `Hi <strong>${name}</strong>,`,
    `
      <p>Your appointment has been <strong>successfully confirmed</strong> with the following details:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${slot}</li>
        <li><strong>Clinic:</strong> ${clinic}</li>
        <li><strong>Reason:</strong> ${reason || "N/A"}</li>
      </ul>
      <p>We're looking forward to seeing you. If you have any questions or need to reschedule, feel free to contact us.</p>
    `
  );

  await transporter.sendMail({
    from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Appointment Confirmation",
    html,
  });
};

// Appointment Reschedule
const sendStyledRescheduleEmail = async ({ name, email, date, slot, clinic }) => {
  const html = getStyledTemplate(
    "Appointment Rescheduled",
    `Hi <strong>${name}</strong>,`,
    `
      <p>Your appointment has been <strong>rescheduled</strong> to the following details:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${slot}</li>
        <li><strong>Clinic:</strong> ${clinic}</li>
      </ul>
      <p>If you did not request this change, please contact us immediately.</p>
    `
  );

  await transporter.sendMail({
    from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Appointment Rescheduled",
    html,
  });
};

// Appointment Cancellation
const sendStyledCancellationEmail = async ({ name, email, date, slot, clinic }) => {
  const html = getStyledTemplate(
    "Appointment Cancelled",
    `Hi <strong>${name}</strong>,`,
    `
      <p>Your appointment scheduled for:</p>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${slot}</li>
        <li><strong>Clinic:</strong> ${clinic}</li>
      </ul>
      <p>has been <strong>cancelled</strong>. We hope to see you again soon!</p>
    `
  );

  await transporter.sendMail({
    from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Appointment Cancelled",
    html,
  });
};



module.exports = {
    sendWelcomeEmail,
  sendStyledAppointmentEmail,
  sendStyledRescheduleEmail,
  sendStyledCancellationEmail,
};
