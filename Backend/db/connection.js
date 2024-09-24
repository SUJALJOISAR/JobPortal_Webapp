import mysql from 'mysql2';

export const connectDatabase= async ()=>{
    try {
        const db=mysql.createConnection({
            host:'localhost',
            user:"root",
            password:process.env.DATABASE_PASS,
            database:"jobsch"
        });

        db.connect((err)=>{
            if(err){
                console.error(err);
            }
            else{
                console.log("DB Connection Successfull!!");
            }
        })

        return db;
    } catch (error) {
        throw error;
    }  
}