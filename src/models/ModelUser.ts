import { QueryCondition } from "BaseService/interfaces/iModel";
import { Model } from "BaseService/db/Model";
import uuid = require("uuid");

export class User {
  public id: string;
  public org_id: string;
  public email: string;
  public first_name: string;
  public last_name: string;
  public password: string;
  public phone_number: string;
  public verify_code: string;
  public team_id: string;
  public permission: any;
  public activated: boolean;
  public is_super: boolean;
  public is_deleted: boolean;
  public created_at: Date;
  public updated_at: Date;
  public initOrg(
    $id: string,
    $org_id: string,
    $email: string,
    $first_name: string,
    $last_name: string,
    $password: string,
    $phone_number: string,
    $verify_code: string,
  ) {
    this.init(
      $id,
      $org_id,
      $email,
      $first_name,
      $last_name,
      $password,
      $phone_number,
      $verify_code,
    );
  }

  public init(
    $id: string,
    $org_id: string,
    $email: string,
    $first_name: string,
    $last_name: string,
    $password: string,
    $phone_number: string,
    $verify_code: string,
  ) {
    this.id = $id;
    this.org_id = $org_id;
    this.email = $email;
    this.first_name = $first_name;
    this.last_name = $last_name;
    this.password = $password;
    this.phone_number = $phone_number;
    this.verify_code = $verify_code;
    this.activated = this.is_super = this.is_deleted = false;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ModelUser extends Model<User> {
  public tableName: string = "user";

  public async getUserByEmail(email: string): Promise<any> {
    return await this.select("*")
      .where({
        email,
      })
      .first();
  }

  public async isActiveVerifyCode(
    email: string,
    verifyCode: string,
  ): Promise<boolean> {
    return await this.select("id")
      .where({
        email,
        activated: true,
        is_deleted: false,
        verify_code: verifyCode,
      })
      .first();
  }

  public async updateUserPassword(
    email: string,
    verifyCode: string,
    newPassword: string,
  ): Promise<boolean> {
    const query: QueryCondition[] = new Array<QueryCondition>(
      new QueryCondition("email", "=", email),
      new QueryCondition("activated", "=", true),
      new QueryCondition("is_deleted", "=", false),
      new QueryCondition("verify_code", "=", verifyCode),
    );
    const result = await this.update(
      { password: newPassword, verify_code: uuid.v4() },
      query,
      ["id"],
    );
    if (!result || (result && result.length == 0)) {
      return false;
    }
    return true;
  }
}
