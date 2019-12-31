import * as Knex from "knex";

const function_name = 'normalize_string';
export async function up(knex: Knex): Promise<any> {
  await knex.raw(
    `
        CREATE OR REPLACE FUNCTION ${function_name} (x text) RETURNS text AS
        $$
        DECLARE
        accent_text text; unaccent_text text; r text;
        BEGIN
        accent_text = 'áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ';
        unaccent_text = 'aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY';
        r = x;
        FOR i IN 0..length(accent_text)
        LOOP
        r = replace(r, substr(accent_text,i,1), substr(unaccent_text,i,1));
        END LOOP;
        RETURN r;
        END;
        $$ LANGUAGE plpgsql;
    `);
}


export async function down(knex: Knex): Promise<any> {
  await knex.raw(`DROP FUNCTION IF EXISTS ${function_name};`);
}

