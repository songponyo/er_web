import jwt_decode from "jwt-decode";

export default class PermissionController {
  getPermissionToken() {
    try {
      const { permission } = jwt_decode(
        localStorage.getItem("permission-token")
      );

      if (permission === null || permission === undefined) {
        return [];
      } else {
        return permission;
      }
    } catch (error) {
      console.log("error", error);
      return [];
    }
  }

  getPermissionMenu(menu) {
    const DEFINE_PERMISSION = {
      permission_view: true,
      permission_add: true,
      permission_edit: true,
      permission_approve: true,
      permission_cancel: true,
      permission_delete: true,
    };

    try {
      const { permission } = jwt_decode(
        localStorage.getItem("permission-token")
      );

      if (permission === null || permission === undefined) {
        return DEFINE_PERMISSION;
      } else {
        const access = permission.find((item) => item.menu_name_en === menu);

        if (access === undefined) {
          return DEFINE_PERMISSION;
        } else {
          return access;
        }
      }
    } catch (error) {
      console.log("error", error);
      return DEFINE_PERMISSION;
    }
  }
}
