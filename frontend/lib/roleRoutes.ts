export const roleToRoute = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "SEEKER":
      return "/dashboard/seeker";
    case "DONOR":
      return "/dashboard/donor";
    case "HOSPITAL":
      return "/dashboard/hospital";
    case "BLOOD_BANK":
      return "/dashboard/blood-bank";
    default:
      return "/auth/login";
  }
};