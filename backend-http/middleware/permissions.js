const permissions = {
  /* User Permissions */
  AddUser: "AddUser", // Invite a new user
  DeleteActiveUser: "DeleteActiveUser", // Delete an existing registered user
  DeletePendingUser: "DeletePendingUser", // Delete an invited user
  /* Event Permissions */
  AddEvent: "AddEvent", // Create a new event
  EditEvent: "EditEvent", // Edit an event
  DeleteEvent: "DeleteEvent", // Delete and existing event
  /* Sponsor Permissions */
  AddSponsor: "AddSponsor", // Create new sponsor
  EditSponsor: "EditSponsor", // Edit sponsor (itself, contacts, items)
  DeleteSponsor: "DeleteSponsor", // Delete all things associated with sponsor
  /* Sponsor Tier Permissions */
  AddSponsorTier: "AddSponsorTier", // Create a new tier
  EditSponsorTier: "EditSponsorTier", // Edit an existing tier
  DeleteSponsorTier: "DeleteSponsorTier", // Delete an existing tier if able
  /* Role Permissions */
  AddRole: "AddRole", // Create a new role
  EditRole: "EditRole", // Edit an existing role
  DeleteRole: "DeleteRole", // Delete an existing role if able
};

module.exports = permissions;
