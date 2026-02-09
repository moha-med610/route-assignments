export const otpEmailTemplate = ({ userName, otpCode, expiryMinutes }) => {
  return `
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial; direction:rtl; align="center">
  <table width="100%">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" style="background:#fff; border-radius:8px;">
          <tr>
            <td style="background:#0d6efd; padding:20px; color:#fff; text-align:center;">
              <h2>رمز التحقق (OTP)</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333;">
              <p>مرحبًا <strong>${userName}</strong>،</p>
              <p>رمز التحقق الخاص بك هو:</p>

              <div style="text-align:center; margin:20px 0;">
                <span style="font-size:24px; letter-spacing:4px; font-weight:bold;">
                  ${otpCode}
                </span>
              </div>

              <p>الرمز صالح لمدة <strong>${expiryMinutes} دقائق</strong>.</p>
              <p style="color:#777;">إذا لم تطلب هذا الرمز، تجاهل الرسالة.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px;">
              © ${new Date().getFullYear()} Your Company
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
