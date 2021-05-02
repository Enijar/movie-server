import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Torrent } from "../config/types";

@Table({ tableName: "movies", indexes: [{ unique: true, fields: ["ytsId"] }] })
export default class Movie extends Model {
  @Column
  ytsId: number;

  @Column
  title: string;

  @Column
  year: number;

  @Column
  rating: number;

  @Column
  runtime: number;

  @Column(DataType.TEXT)
  summary: string;

  @Column
  coverImage: string;

  @Column(DataType.JSON)
  torrent: Torrent;
}
