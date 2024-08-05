import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1722653266259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE BrazilianState AS ENUM (
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 
        'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 
        'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 
        'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 
        'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
      );`,
    );

    await queryRunner.query(
      `CREATE TABLE farmers (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(11),
        cnpj VARCHAR(14),
        farmerName VARCHAR(255) NOT NULL,
        farmName VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state BrazilianState NOT NULL,
        totalFarmArea DECIMAL(10, 2) NOT NULL,
        totalArableArea DECIMAL(10, 2) NOT NULL,
        totalVegetationArea DECIMAL(10, 2) NOT NULL,
        UNIQUE(cpf, cnpj)
      );`,
    );

    await queryRunner.query(
      `CREATE TABLE crops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        farmerId INT,
        FOREIGN KEY (farmerId) REFERENCES farmers(id) ON DELETE CASCADE ON UPDATE CASCADE
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE crops;`);
    await queryRunner.query(`DROP TABLE farmers;`);
    await queryRunner.query(`DROP TYPE BrazilianState;`);
  }
}
