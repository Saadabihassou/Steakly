import sendEmail from "@emailjs/browser";

export const sendEmailForNewHabit = async (
  email: string | null | undefined,
  name: string | null | undefined
) => {
  try {
    const templateParams = {
      name,
      email,
      message: `Hello ${name},\n\nYou have successfully added a new habit to your account.\n\nBest,\nSteakly Team`,
        };
        
    if (!email || !name) {
      console.error("Email or name is missing");
      return;
    }

    const response = await sendEmail.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.EMAILJS_PUBLIC_KEY!
    );

    if (response) {
      console.log("Email sent successfully:", response);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
