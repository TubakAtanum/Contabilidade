import * as SQLite from "expo-sqlite";

export const tableName = "tabela";
export const db = SQLite.openDatabase(`${tableName}.db`);
export const getCurrentDate = () => {
  const date = new Date();
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
};

export const getCurrentValue = (category, tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
        SELECT ${category} FROM ${tableName} ORDER BY id DESC LIMIT 1
      `,
        [],
        async (_, result) => {
          const lastValue = await (result.rows.item(0))
          resolve(lastValue);
        },
        (_, error) => {
          reject(console.log(error));
        }
      );
    });
  });
};

export const getLastDate = (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
        SELECT Date FROM ${tableName} ORDER BY id DESC LIMIT 1
      `,
        [],
        async (_, result) => {
          const lastDate = await (result.rows.item(0)).Date;
          resolve(lastDate);
        },
        (_, error) => {
          reject(console.log(error));
        }
      );
    });
  });
};

export const getTableHeaders = (db, tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (_, result) => {
          const rows = result.rows;
          const columnNames = Object.keys(rows.item(0)).slice(1);
          const tableData = [];

          for (let i = 0; i < rows.length; i++) {
            const rowData = [];
            for (let j = 0; j < columnNames.length; j++) {
              rowData.push(rows.item(i)[columnNames[j]]);
            }
            tableData.push(rowData);
          }
          resolve({ columnNames, tableData });
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
