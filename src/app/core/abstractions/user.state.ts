import { IUser } from "../interfaces/user.interface";
import { ABehaviorSubjectState } from "./behavior-subject-state.abstract";


export class UserState extends ABehaviorSubjectState<IUser> { }
