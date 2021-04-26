import { Column, Default, Model, Table } from "sequelize-typescript";

@Table({ tableName: "jobs", indexes: [{ unique: true, fields: ["name"] }] })
export default class Job extends Model {
  @Column
  name: number;

  @Column
  lastRun: Date;

  @Default(false)
  @Column
  processing: boolean;

  @Column
  interval: number;
}
