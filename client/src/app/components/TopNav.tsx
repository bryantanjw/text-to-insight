import { TopNavigation } from "@cloudscape-design/components";

const i18nStrings = {
  searchIconAriaLabel: "Search",
  searchDismissIconAriaLabel: "Close search",
  overflowMenuTriggerText: "More",
  overflowMenuTitleText: "All",
  overflowMenuBackIconAriaLabel: "Back",
  overflowMenuDismissIconAriaLabel: "Close menu",
};

const profileActions = [
  { type: "button", id: "profile", text: "Profile" },
  { type: "button", id: "preferences", text: "Preferences" },
  { type: "button", id: "security", text: "Security" },
  {
    type: "menu-dropdown",
    id: "support-group",
    text: "Support",
    items: [
      {
        id: "documentation",
        text: "Documentation",
        href: "#",
        external: true,
        externalIconAriaLabel: " (opens in new tab)",
      },
      {
        id: "feedback",
        text: "Feedback",
        href: "#",
        external: true,
        externalIconAriaLabel: " (opens in new tab)",
      },
      { id: "support", text: "Customer support" },
    ],
  },
  { type: "button", id: "signout", text: "Sign out" },
];

export default function TopNav() {
  return (
    <TopNavigation
      i18nStrings={i18nStrings}
      identity={{
        href: "#",
        logo: {
          src: "logo.svg",
          alt: "AWS Logo",
        },
      }}
      utilities={[
        {
          type: "button",
          iconName: "notification",
          ariaLabel: "Notifications",
          badge: true,
          disableUtilityCollapse: true,
        },
        {
          type: "button",
          iconName: "settings",
          title: "Settings",
          ariaLabel: "Settings",
        },
        {
          type: "menu-dropdown",
          text: "Bryan Tan",
          description: "jutann@amazon.com",
          iconName: "user-profile",
          items: profileActions,
        },
      ]}
    />
  );
}
