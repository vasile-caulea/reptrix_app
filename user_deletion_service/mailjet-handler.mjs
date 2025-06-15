import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
);


export async function sendUserDeletedEmail(toEmail) {

    return mailjetClient
        .post("send", { version: "v3.1" })
        .request({
            Messages: [
                {
                    From: {
                        Email: process.env.FROM_EMAIL,
                        Name: "Fitness App"
                    },
                    To: [
                        {
                            Email: toEmail,
                            Name: "User"
                        }
                    ],
                    Subject: "Account Deleted Successfully",
                    TextPart: "Your account has been deleted successfully from our system.",
                    HTMLPart: "<h3>Your Reptrix account has been deleted successfully from our system.</h3>"
                }
            ]
        });
}

export async function sendUserDeletionFailedEmail(toEmail) {
    return mailjetClient
        .post("send", { version: "v3.1" })
        .request({
            Messages: [
                {
                    From: {
                        Email: process.env.FROM_EMAIL,
                        Name: "Fitness App"
                    },
                    To: [
                        {
                            Email: toEmail,
                            Name: "User"
                        }
                    ],
                    Subject: "Account Deletion Failed",
                    TextPart: "Your account deletion failed. Please contact support with an reply to this conversation.",
                    HTMLPart: "<h3>Your Reptrix account deletion failed. Please contact support.</h3>"
                }
            ]
        });
}

