export class ResponseModel {
    Response: any;
    Code: any;
}

export class Header {
    StatusCode: number;
    Desc: string;
}

export class UserRegistrationDetails {
    name: string;
    username: string;
    password: string;
}

export class UpdateUserRegistrationDetails {
    name: string;
    username: string;
    password: string;
    oldpassword: string;
    newpassword: string;
}

