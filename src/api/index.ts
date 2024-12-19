import itemController from "./Item/item.controller";
import userController from "./user/user.controller";

export = [
    new userController(),
    new itemController()
]