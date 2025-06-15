export const mockTickets = [
  {
    _id: "1",
    subject: "Can't login to my account",
    description: "I'm unable to login even with correct credentials. Getting error 500.",
    status: "open",
    priority: "high",
    createdAt: "2025-05-15T10:30:00Z",
    user: { name: "heera", email: "heera@example.com" },
    replies: [
      {
        content: "<p>Have you tried resetting your password?</p>",
        user: { name: "Support Agent", role: "agent" },
        createdAt: "2025-05-15T11:15:00Z"
      },
      {
        content: "<p>Yes, I tried but didn't receive the reset email.</p>",
        user: { name: "heera", email: "heera@example.com" },
        createdAt: "2025-05-15T13:45:00Z"
      }
    ]
  },
  {
    _id: "2",
    subject: "Feature request: Dark mode",
    description: "Please add dark mode to the dashboard interface. My eyes get strained at night.",
    status: "pending",
    priority: "medium",
    createdAt: "2025-05-10T14:20:00Z",
    user: { name: "Ranjith", email: "ranjith@example.com" },
    replies: []
  },
  {
    _id: "3",
    subject: "Payment not processed",
    description: "My subscription payment failed but was deducted from my account. Transaction ID: TXN789456",
    status: "resolved",
    priority: "high",
    createdAt: "2025-05-05T09:45:00Z",
    user: { name: "Ranjith", email: "ranjith@example.com" },
    replies: [
      {
        content: "<p>We've refunded your payment. Please check your bank in 3-5 business days.</p>",
        user: { name: "Billing Dept", role: "agent" },
        createdAt: "2025-05-05T16:30:00Z"
      }
    ]
  },
  {
    _id: "4",
    subject: "Bug report: Form validation error",
    description: "The contact form shows incorrect validation for phone numbers. Accepts invalid formats.",
    status: "open",
    priority: "medium",
    createdAt: "2025-05-18T08:15:00Z",
    user: { name: "Vetri", email: "vetri@example.com" },
    replies: [
      {
        content: "<p>Thanks for reporting. We've logged this issue (BUG-427) and will fix it in the next release.</p>",
        user: { name: "Dev Team", role: "agent" },
        createdAt: "2025-05-18T10:30:00Z"
      }
    ]
  },
  {
    _id: "5",
    subject: "Account deletion request",
    description: "I want to permanently delete my account and all associated data per GDPR.",
    status: "pending",
    priority: "high",
    createdAt: "2025-05-20T16:45:00Z",
    user: { name: "Arul", email: "arul@example.com" },
    replies: []
  },
  {
    _id: "6",
    subject: "Dashboard loading slowly",
    description: "The analytics dashboard takes over 30 seconds to load since yesterday.",
    status: "open",
    priority: "medium",
    createdAt: "2025-05-19T09:20:00Z",
    user: { name: "Rocky", email: "rocky@example.com" },
    replies: [
      {
        content: "<p>We're investigating performance issues. Could you share your browser console logs?</p>",
        user: { name: "Tech Support", role: "agent" },
        createdAt: "2025-05-19T11:45:00Z"
      }
    ]
  },
  {
    _id: "7",
    subject: "Two-factor authentication not working",
    description: "Not receiving SMS codes for 2FA. Phone number +1 555-123-4567 is correct.",
    status: "resolved",
    priority: "high",
    createdAt: "2025-05-12T14:10:00Z",
    user: { name: "Magizh", email: "magizh@example.com" },
    replies: [
      {
        content: "<p>We found issues with our SMS provider. Please try using an authenticator app instead.</p>",
        user: { name: "Security Team", role: "agent" },
        createdAt: "2023-05-12T15:30:00Z"
      },
      {
        content: "<p>Thanks! The authenticator app works perfectly.</p>",
        user: { name: "Magizh", email: "magizh@example.com" },
        createdAt: "2025-05-12T16:45:00Z"
      }
    ]
  },
  {
    _id: "8",
    subject: "Invoice missing",
    description: "Haven't received invoice for May subscription. Payment was processed on May 1st.",
    status: "pending",
    priority: "low",
    createdAt: "2025-05-17T11:30:00Z",
    user: { name: "Libi", email: "libi@example.com" },
    replies: []
  }
];