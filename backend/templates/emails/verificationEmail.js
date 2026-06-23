export const verificationEmailTemplate = (verifyUrl) => {
	const year = new Date().getFullYear();

	return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <link rel="preload" as="image" href="https://i.postimg.cc/J73dT3Df/logo-light.png" />
        <link rel="preload" as="image" href="https://i.postimg.cc/J4Nm5BMy/verification-email.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <style>
          .md_text-5xl {
            @media (width>=48rem) {
              font-size: 3rem !important;
              line-height: 1 !important;
            }
          }
        </style>
        <style>
          @font-face {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 400;
            mso-font-alt: 'sans-serif';
            src: url(https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJtEtq.woff2) format('woff2');
          }

          * {
            font-family: 'Outfit', sans-serif;
          }
        </style>
        <style>
          @font-face {
            font-family: 'Outfit';
            font-style: normal;
            font-weight: 700;
            mso-font-alt: 'sans-serif';
            src: url(https://fonts.gstatic.com/s/outfit/v15/QGYvz_MVcBeNP4NJtEtq.woff2) format('woff2');
          }

          * {
            font-family: 'Outfit', sans-serif;
          }
        </style>
      </head>
      <body style="background-color: rgb(41, 37, 36); margin: 0; padding: 0">
        <!--$--><!--html--><!--head--><!--body-->
        <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
          <tbody>
            <tr>
              <td style="margin: 0; background-color: rgb(41, 37, 36); padding: 0; font-family: Outfit, sans-serif">
                <div
                  style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0"
                  data-skip-in-text="true">
                  Verify Your Email Address
                </div>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="max-width: 640px; margin-right: auto; margin-left: auto; background-color: rgb(28, 25, 23)">
                  <tbody>
                    <tr style="width: 100%">
                      <td>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="padding-bottom: 0.5rem; padding-top: 0.5rem; padding-left: 1.25rem; text-align: center">
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  align="center"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation">
                                  <tbody style="width: 100%">
                                    <tr style="width: 100%">
                                      <td align="center" data-id="__react-email-column">
                                        <img
                                          alt="Logo"
                                          src="https://i.postimg.cc/J73dT3Df/logo-light.png"
                                          style="
                                            display: block;
                                            outline: none;
                                            border: none;
                                            text-decoration: none;
                                            width: 9rem;
                                          " />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="padding-right: 1.5rem; padding-left: 1.5rem">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  alt="Illustration"
                                  src="https://i.postimg.cc/J4Nm5BMy/verification-email.png"
                                  style="display: block; outline: none; border: none; text-decoration: none; width: 100%" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="padding-right: 1.5rem; padding-left: 1.5rem; padding-bottom: 3.5rem; padding-top: 3.5rem">
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  align="center"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="margin-bottom: 3rem">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <p
                                          class="md_text-5xl xs:text-4xl"
                                          style="
                                            font-size: 1.875rem;
                                            line-height: 1.2;
                                            margin: 0;
                                            font-weight: 700;
                                            color: rgb(245, 245, 244);
                                            margin-top: 0;
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          ALMOST THERE
                                        </p>
                                        <p
                                          style="
                                            font-size: 0.875rem;
                                            line-height: 1.4285714285714286;
                                            margin: 0;
                                            margin-top: 18px;
                                            color: rgb(166, 160, 155);
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          Thank you for signing up for Forever.
                                        </p>
                                        <p
                                          style="
                                            font-size: 0.875rem;
                                            line-height: 1.4285714285714286;
                                            margin: 0;
                                            color: rgb(166, 160, 155);
                                            margin-top: 0;
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          To verify your account, we just need to confirm your email.
                                        </p>
                                        <p
                                          style="
                                            font-size: 0.75rem;
                                            line-height: 1.3333333333333333;
                                            margin: 0;
                                            margin-top: 18px;
                                            color: rgb(209, 213, 220);
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          If you didn&#x27;t create an account, you can safely ignore this email.
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <a
                                  href="${verifyUrl}"
                                  style="
                                    line-height: 1.5;
                                    text-decoration: none;
                                    display: inline-block;
                                    max-width: 100%;
                                    mso-padding-alt: 0px;
                                    background-color: rgb(245, 245, 244);
                                    text-align: center;
                                    font-size: 1rem;
                                    color: rgb(41, 37, 36);
                                    font-weight: 500;
                                    text-decoration-line: none;
                                    padding: 12px 24px;
                                    padding-top: 12px;
                                    padding-right: 24px;
                                    padding-bottom: 12px;
                                    padding-left: 24px;
                                  "
                                  target="_blank"
                                  ><span
                                    ><!--[if mso
                                      ]><i style="mso-font-width: 400%; mso-text-raise: 18" hidden
                                        >&#8202;&#8202;&#8202;</i
                                      ><!
                                    [endif]--></span
                                  ><span
                                    style="
                                      max-width: 100%;
                                      display: inline-block;
                                      line-height: 120%;
                                      mso-padding-alt: 0px;
                                      mso-text-raise: 9px;
                                    "
                                    >Confirm Email</span
                                  ><span
                                    ><!--[if mso
                                      ]><i style="mso-font-width: 400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><!
                                    [endif]--></span
                                  ></a
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="
                            border-top-style: solid;
                            border-top-width: 1px;
                            border-color: rgb(166, 160, 155);
                            padding-right: 1.5rem;
                            padding-left: 1.5rem;
                            padding-bottom: 3.5rem;
                            padding-top: 3.5rem;
                          ">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  alt="Logo"
                                  src="https://i.postimg.cc/J73dT3Df/logo-light.png"
                                  style="
                                    display: block;
                                    outline: none;
                                    border: none;
                                    text-decoration: none;
                                    width: 8rem;
                                    margin-left: -0.25rem;
                                  " />
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="margin-top: 1rem">
                                  <tbody style="width: 100%">
                                    <tr style="width: 100%">
                                      <td data-id="__react-email-column" style="width: 100%; vertical-align: top">
                                        <table
                                          align="left"
                                          width="100%"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          role="presentation"
                                          style="width: auto; table-layout: auto">
                                          <tbody>
                                            <tr>
                                              <td>
                                                <table
                                                  align="left"
                                                  width="100%"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation">
                                                  <tbody style="width: 100%">
                                                    <tr style="width: 100%">
                                                      <td data-id="__react-email-column" style="width: auto">
                                                        <a
                                                          href="https://example.com/"
                                                          style="
                                                            color: #067df7;
                                                            text-decoration-line: none;
                                                            display: inline-block;
                                                          "
                                                          target="_blank"
                                                          ><p
                                                            style="
                                                              font-size: 0.75rem;
                                                              line-height: 1.3333333333333333;
                                                              margin: 0;
                                                              color: rgb(214, 211, 209);
                                                              margin-top: 0;
                                                              margin-bottom: 0;
                                                              margin-left: 0;
                                                              margin-right: 0;
                                                            ">
                                                            Privacy Policy
                                                          </p></a
                                                        >
                                                      </td>
                                                      <td
                                                        data-id="__react-email-column"
                                                        style="
                                                          padding-right: 0.25rem;
                                                          padding-left: 0.25rem;
                                                          color: rgb(121, 113, 107);
                                                          font-size: 0.75rem;
                                                          line-height: 1.3333333333333333;
                                                          vertical-align: middle;
                                                        ">
                                                        |
                                                      </td>
                                                      <td data-id="__react-email-column" style="width: auto">
                                                        <a
                                                          href="https://example.com/"
                                                          style="
                                                            color: #067df7;
                                                            text-decoration-line: none;
                                                            display: inline-block;
                                                          "
                                                          target="_blank"
                                                          ><p
                                                            style="
                                                              font-size: 0.75rem;
                                                              line-height: 1.3333333333333333;
                                                              margin: 0;
                                                              color: rgb(214, 211, 209);
                                                              margin-top: 0;
                                                              margin-bottom: 0;
                                                              margin-left: 0;
                                                              margin-right: 0;
                                                            ">
                                                            Help
                                                          </p></a
                                                        >
                                                      </td>
                                                      <td
                                                        data-id="__react-email-column"
                                                        style="
                                                          padding-right: 0.25rem;
                                                          padding-left: 0.25rem;
                                                          color: rgb(121, 113, 107);
                                                          font-size: 0.75rem;
                                                          line-height: 1.3333333333333333;
                                                          vertical-align: middle;
                                                        ">
                                                        |
                                                      </td>
                                                      <td data-id="__react-email-column" style="width: auto">
                                                        <a
                                                          href="https://example.com/"
                                                          style="
                                                            color: #067df7;
                                                            text-decoration-line: none;
                                                            display: inline-block;
                                                          "
                                                          target="_blank"
                                                          ><p
                                                            style="
                                                              font-size: 0.75rem;
                                                              line-height: 1.3333333333333333;
                                                              margin: 0;
                                                              color: rgb(214, 211, 209);
                                                              margin-top: 0;
                                                              margin-bottom: 0;
                                                              margin-left: 0;
                                                              margin-right: 0;
                                                            ">
                                                            About Us
                                                          </p></a
                                                        >
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation"
                                  style="margin-top: 1rem">
                                  <tbody style="width: 100%">
                                    <tr style="width: 100%">
                                      <td data-id="__react-email-column" style="width: 100%; vertical-align: top">
                                        <p
                                          style="
                                            font-size: 0.75rem;
                                            line-height: 20px;
                                            margin: 0;
                                            color: rgb(121, 113, 107);
                                            margin-top: 0;
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          This email was sent to you by Forever Store. You are receiving this email because
                                          you registered on Forever. If you wish to unsubscribe from all future emails,
                                          please<!-- -->
                                          <a
                                            href="https://example.com/"
                                            style="color: rgb(166, 160, 155); text-decoration-line: underline"
                                            >click here</a
                                          >
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  align="left"
                                  width="100%"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  role="presentation">
                                  <tbody style="width: 100%">
                                    <tr style="width: 100%">
                                      <td
                                        data-id="__react-email-column"
                                        style="width: 100%; padding-top: 1.25rem; vertical-align: top">
                                        <p
                                          style="
                                            font-size: 0.75rem;
                                            line-height: 1.3333333333333333;
                                            margin: 0;
                                            color: rgb(121, 113, 107);
                                            margin-top: 0;
                                            margin-bottom: 0;
                                            margin-left: 0;
                                            margin-right: 0;
                                          ">
                                          ©${year} Forever - All Rights Reserved
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <!--/$-->
      </body>
    </html>
  `;
};

