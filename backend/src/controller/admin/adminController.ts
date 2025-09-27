import * as adminModel from "../../model/admin/adminModel.js";

export let loginAdmin = async (
  email: string,
  password: string
): Promise<[number, string]> => {
  let [status, message] = await adminModel.loginAdmin(email, password);
  return [status, message];
};
