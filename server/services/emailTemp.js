const emailVerifyTem = ({ otp }) => {
  const appName = process.env.APP_NAME || "E-Commerce";
  const year = new Date().getFullYear();
  return `
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color:#1a73e8; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">Verify Your Email</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333;">
                <p style="margin:0 0 15px; font-size:15px;">Hi there,</p>
                <p style="margin:0 0 20px; font-size:15px; line-height:1.5;">
                  Thank you for creating an account with <strong>${appName}</strong>.
                  Please use the OTP below to verify your email address.
                </p>
                <div style="text-align:center; margin:30px 0;">
                  <span style="display:inline-block; font-size:28px; letter-spacing:6px; padding:15px 25px; background-color:#f1f3f4; color:#1a73e8; font-weight:bold; border-radius:6px;">${otp}</span>
                </div>
                <p style="margin:0 0 15px; font-size:14px;">This OTP is valid for <strong>2 minutes</strong>.</p>
                <p style="margin:0; font-size:14px; color:#777777;">
                  If you didn't request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#f4f6f8; padding:15px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#999999;">© ${year} ${appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`;
};

const resetPassEmailTemp = ({ otp }) => {
  const appName = process.env.APP_NAME || "E-Commerce";
  const year = new Date().getFullYear();
  return `
  <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:6px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color:#2f80ed; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; font-size:24px; margin:0;">Password Reset</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 15px 0;">Hello,</p>
                <p style="margin:0 0 15px 0;">
                  We received a request to reset your password. Click the button below to create a new one.
                </p>
                <!-- Button -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="${otp}" style="background-color:#2f80ed; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:4px; display:inline-block; font-weight:bold;">
                    Reset Password
                  </a>
                </p>
                <p style="margin:0 0 15px 0;">
                  This link will expire in <strong>2 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="margin:0;">
                  Thanks,<br />
                  <strong>${appName} Team</strong>
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#f0f2f4; padding:15px; text-align:center; font-size:12px; color:#777777;">
                <p style="margin:0;">© ${year} ${appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
};

module.exports = { emailVerifyTem, resetPassEmailTemp };
