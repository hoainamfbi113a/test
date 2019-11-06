import { BaseRepository } from "base-service/dist/type-orm/repositories/common/base.repository";
import { EntityRepository } from "typeorm";
import { Package } from "../entity/primary/package";

@EntityRepository(Package)
export class PackageRepository extends BaseRepository<Package> {

}
