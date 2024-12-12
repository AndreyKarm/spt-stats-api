const sqlite = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './data/db.sqlite');
const chalk = require('chalk');

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log(chalk.blue('Connected to the database.'));

    db.run(`CREATE TABLE IF NOT EXISTS stats (
        date TIMESTAMP,
        id TEXT,
        nickname TEXT,
        exp INTEGER,
        totalInGameTime INTEGER,
        CurrentWinStreak INTEGER,
        Sessions INTEGER,
        ExitStatus INTEGER,
        LifeTime INTEGER,
        Kills INTEGER,
        Deaths INTEGER,
        KilledBear INTEGER,
        KilledUsec INTEGER,
        KilledSavage INTEGER,
        KilledPmc INTEGER,
        KilledBoss INTEGER,
        KilledWithKnife INTEGER,
        KilledWithPistol INTEGER,
        KilledWithSmg INTEGER,
        KilledWithShotgun INTEGER,
        KilledWithAssaultRifle INTEGER,
        KilledWithAssaultCarabine INTEGER,
        KilledWithGrenadeLauncher INTEGER,
        KilledWithMachinegun INTEGER,
        KilledWithMarksmanRifle INTEGER,
        KilledWithSniperRifle INTEGER,
        KilledWithSpecialWeapon INTEGER,
        KilledWithThrownWeapon INTEGER,
        KilledTripwires INTEGER,
        HeadShots INTEGER,
        BloodLoss INTEGER,
        BodyPartsDestroyed INTEGER,
        Heal INTEGER,
        Fractures INTEGER,
        Contusion INTEGER,
        Dehydration INTEGER,
        Exhaustion INTEGER,
        Medcines INTEGER,
        BodiesLooted INTEGER,
        SafeLooted INTEGER,
        Weapons INTEGER,
        Ammunition INTEGER,
        Mods INTEGER,
        ThrowWeapons INTEGER,
        SpecialItems INTEGER,
        BartItems INTEGER,
        CauseBodyDamage INTEGER,
        CauseArmorDamage INTEGER,
        HitCount INTEGER,
        MoneyRUB INTEGER,
        MoneyEUR INTEGER,
        MoneyUSD INTEGER,
        AmmoUsed INTEGER,
        CombatDamage INTEGER
    )`);
});

function addData(data) {
    return new Promise((resolve, reject) => {
        console.log(chalk.blue('Adding data to database...'));
        const processedData = processData(data);

        const sql = `
            INSERT INTO stats (
                date,
                id,
                nickname,
                exp,
                totalInGameTime,
                CurrentWinStreak,
                Sessions,
                ExitStatus,
                LifeTime,
                Kills,
                Deaths,
                KilledBear,
                KilledUsec,
                KilledSavage,
                KilledPmc,
                KilledBoss,
                KilledWithKnife,
                KilledWithPistol,
                KilledWithSmg,
                KilledWithShotgun,
                KilledWithAssaultRifle,
                KilledWithAssaultCarabine,
                KilledWithGrenadeLauncher,
                KilledWithMachinegun,
                KilledWithMarksmanRifle,
                KilledWithSniperRifle,
                KilledWithSpecialWeapon,
                KilledWithThrownWeapon,
                KilledTripwires,
                HeadShots,
                BloodLoss,
                BodyPartsDestroyed,
                Heal,
                Fractures,
                Contusion,
                Dehydration,
                Exhaustion,
                Medcines,
                BodiesLooted,
                SafeLooted,
                Weapons,
                Ammunition,
                Mods,
                ThrowWeapons,
                SpecialItems,
                BartItems,
                CauseBodyDamage,
                CauseArmorDamage,
                HitCount,
                MoneyRUB,
                MoneyEUR,
                MoneyUSD,
                AmmoUsed,
                CombatDamage
            ) VALUES (
                strftime('%Y-%m-%d %H:00:00', 'now', 'localtime'),
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;

        const params = [
            processedData.id,
            processedData.nickname,
            processedData.exp,
            processedData.totalInGameTime,
            processedData.overallCounters.CurrentWinStreak,
            processedData.overallCounters.Sessions,
            processedData.overallCounters.ExitStatus,
            processedData.overallCounters.LifeTime,
            processedData.overallCounters.Kills,
            processedData.overallCounters.Deaths,
            processedData.overallCounters.KilledBear,
            processedData.overallCounters.KilledUsec,
            processedData.overallCounters.KilledSavage,
            processedData.overallCounters.KilledPmc,
            processedData.overallCounters.KilledBoss,
            processedData.overallCounters.KilledWithKnife,
            processedData.overallCounters.KilledWithPistol,
            processedData.overallCounters.KilledWithSmg,
            processedData.overallCounters.KilledWithShotgun,
            processedData.overallCounters.KilledWithAssaultRifle,
            processedData.overallCounters.KilledWithAssaultCarbine,
            processedData.overallCounters.KilledWithGrenadeLauncher,
            processedData.overallCounters.KilledWithMachineGun,
            processedData.overallCounters.KilledWithMarksmanRifle,
            processedData.overallCounters.KilledWithSniperRifle,
            processedData.overallCounters.KilledWithSpecialWeapon,
            processedData.overallCounters.KilledWithThrowWeapon,
            processedData.overallCounters.KilledWithTripwires,
            processedData.overallCounters.HeadShots,
            processedData.overallCounters.BloodLoss,
            processedData.overallCounters.BodyPartsDestroyed,
            processedData.overallCounters.Heal,
            processedData.overallCounters.Fractures,
            processedData.overallCounters.Contusions,
            processedData.overallCounters.Dehydrations,
            processedData.overallCounters.Exhaustions,
            processedData.overallCounters.Medicines,
            processedData.overallCounters.BodiesLooted,
            processedData.overallCounters.SafeLooted,
            processedData.overallCounters.Weapons,
            processedData.overallCounters.Ammunitions,
            processedData.overallCounters.Mods,
            processedData.overallCounters.ThrowWeapons,
            processedData.overallCounters.SpecialItems,
            processedData.overallCounters.BartItems,
            processedData.overallCounters.CauseBodyDamage,
            processedData.overallCounters.CauseArmorDamage,
            processedData.overallCounters.HitCount,
            processedData.overallCounters.MoneyRUB,
            processedData.overallCounters.MoneyEUR,
            processedData.overallCounters.MoneyUSD,
            processedData.overallCounters.AmmoUsed,
            processedData.overallCounters.CombatDamage
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error inserting data:', err);
                reject(err);
            } else {
                console.log('Data inserted successfully');
                resolve();
            }
        });
    });
}

function processData(response) {
    const data = response.data;

    const extractedData = {
        id: data.id,
        nickname: data.info.nickname,
        exp: data.info.experience,
        totalInGameTime: data.pmcStats.eft.totalInGameTime,
        overallCounters: {
            CurrentWinStreak: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "CurrentWinStreak"),
            Sessions: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Sessions"),
            ExitStatus: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "ExitStatus"),
            LifeTime: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "LifeTime"),
            Kills: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Kills"),
            Deaths: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Deaths"),
            KilledBear: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledBear"),
            KilledUsec: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledUsec"),
            KilledSavage: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledSavage"),
            KilledPmc: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledPmc"),
            KilledBoss: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledBoss"),
            KilledWithKnife: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithKnife"),
            KilledWithPistol: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithPistol"),
            KilledWithSmg: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithSmg"),
            KilledWithShotgun: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithShotgun"),
            KilledWithAssaultRifle: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithAssaultRifle"),
            KilledWithAssaultCarbine: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithAssaultCarbine"),
            KilledWithGrenadeLauncher: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithGrenadeLauncher"),
            KilledWithMachineGun: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithMachineGun"),
            KilledWithMarksmanRifle: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithMarksmanRifle"),
            KilledWithSniperRifle: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithSniperRifle"),
            KilledWithSpecialWeapon: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithSpecialWeapon"),
            KilledWithThrowWeapon: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithThrowWeapon"),
            KilledWithTripwires: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "KilledWithTripwires"),
            HeadShots: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "HeadShots"),
            BloodLoss: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "BloodLoss"),
            BodyPartsDestroyed: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "BodyPartsDestroyed"),
            Heal: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Heal"),
            Fractures: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Fractures"),
            Contusions: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Contusions"),
            Dehydrations: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Dehydrations"),
            Exhaustions: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Exhaustions"),
            Medicines: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Medicines"),
            BodiesLooted: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "BodiesLooted"),
            SafeLooted: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "SafeLooted"),
            Weapons: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Weapons"),
            Ammunitions: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Ammunitions"),
            Mods: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "Mods"),
            ThrowWeapons: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "ThrowWeapons"),
            SpecialItems: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "SpecialItems"),
            BartItems: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "BartItems"),
            CauseBodyDamage: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "CauseBodyDamage"),
            CauseArmorDamage: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "CauseArmorDamage"),
            HitCount: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "HitCount"),
            MoneyRUB: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "RUB"),
            MoneyEUR: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "EUR"),
            MoneyUSD: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "USD"),
            AmmoUsed: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "AmmoUsed"),
            CombatDamage: findCounterValue(data.pmcStats.eft.overAllCounters.Items, "CombatDamage")
        }
    };
    return extractedData;
}

function findCounterValue(items, key) {
    return items?.find(item => Array.isArray(item.Key) ? item.Key.includes(key) : item.Key === key)?.Value || 0;
}

const validColumns = [
    'id', 'nickname', 'exp', 'totalInGameTime', 'CurrentWinStreak', 
    'Sessions', 'ExitStatus', 'LifeTime', 'Kills', 'Deaths', 
    'KilledBear', 'KilledUsec', 'KilledSavage', 'KilledPmc', 
    'KilledBoss', 'KilledWithKnife', 'KilledWithPistol', 
    'KilledWithSmg', 'KilledWithShotgun', 'KilledWithAssaultRifle',
    'KilledWithAssaultCarabine', 'KilledWithMachinegun', 
    'KilledWithMarksmanRifle', 'KilledWithSniperRifle',
    'KilledWithSpecialWeapon', 'KilledWithThrownWeapon',
    'KilledTripwireMine', 'HeadShots', 'BloodLoss', 
    'BodyPartsDestroyed', 'Heal', 'Fractures', 'Contusion',
    'Tremor', 'Dehydration', 'Exhaustion', 'Medcines',
    'BodiesLooted', 'SafeLooted', 'Weapons', 'Ammunition',
    'Mods', 'ThrowWeapons', 'SpecialItems', 'BartItems',
    'CauseBodyDamage', 'CauseArmorDamage', 'HitCount',
    'MoneyRUB', 'MoneyEUR', 'MoneyUSD', 'AmmoUsed', 'CombatDamage'
];

function getData(body) {
    return new Promise((resolve, reject) => {
        const requestedStats = Array.isArray(body.stat) ? body.stat : [body.stat];

        const invalidStats = requestedStats.filter(stat => !validColumns.includes(stat));
        if (invalidStats.length > 0) {
            reject(new Error(`Invalid stats: ${invalidStats.join(', ')}`));
            return;
        }

        const sql = requestedStats
            .map(stat => `
                SELECT 
                    id,
                    nickname,
                    strftime('%d-%m-%Y-%H-00', date) as date, 
                    ${stat} as value,
                    '${stat}' as stat_name
                FROM stats
                WHERE 
                    date BETWEEN datetime(?, 'start of day') AND datetime(?, '23:59:59')
                    AND ${stat} IS NOT NULL
            `).join(' UNION ALL ') + ' ORDER BY date ASC, id ASC, stat_name ASC';

        const params = requestedStats.reduce((acc, _) => [
            ...acc,
            body.startDate || '1970-01-01',
            body.endDate || new Date().toISOString().split('T')[0]
        ], []);

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            } else {
                const formattedRows = rows.map(row => ({
                    id: row.id,
                    nickname: row.nickname,
                    date: row.date,
                    value: Number(row.value),
                    stat_name: row.stat_name
                }));
                resolve(formattedRows);
            }
        });
    });
}

// Multiple stats
// {
//     "stat": ["exp", "Kills", "Deaths"]
// }

// Optional date range
// {
//     "stat": ["exp", "Kills", "Deaths"],
//     "startDate": "2024-01-01",
//     "endDate": "2024-03-01"
// }

// Single stat (current format) still works
// {
//     "stat": "exp"
// }

module.exports = {
    db,
    addData,
    processData,
    getData,
    validColumns
};






// const sqlite = require('sqlite3').verbose();
// const path = require('path');
// const dbPath = path.resolve(__dirname, './data/db.sqlite');
// const chalk = require('chalk');

// const db = new sqlite.Database(dbPath, (err) => {
//     if (err) {
//         console.error(err.message);
//         return;
//     }
//     console.log(chalk.blue('Connected to the database.'));

//     // Create minimal initial table structure
//     db.run(`CREATE TABLE IF NOT EXISTS stats (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         player_id TEXT,
//         nickname TEXT
//     )`);
// });

// function addColumn(columnName, columnType = 'INTEGER') {
//     return new Promise((resolve, reject) => {
//         db.run(`ALTER TABLE stats ADD COLUMN ${columnName} ${columnType};`, (err) => {
//             if (err) {
//                 // Column might already exist, which is fine
//                 if (err.message.includes('duplicate column name')) {
//                     resolve();
//                 } else {
//                     reject(err);
//                 }
//             } else {
//                 resolve();
//             }
//         });
//     });
// }

// function addData(data) {
//     return new Promise(async (resolve, reject) => {
//         const processedData = processData(data);
        
//         // Get current table info
//         db.all("PRAGMA table_info(stats);", async (err, columns) => {
//             if (err) return reject(err);

//             // Add any missing columns
//             for (const [key, value] of Object.entries(processedData)) {
//                 if (!columns.find(col => col.name === key)) {
//                     const type = typeof value === 'number' ? 'INTEGER' : 'TEXT';
//                     await addColumn(key, type);
//                 }
//             }

//             // Build dynamic INSERT query
//             const keys = Object.keys(processedData);
//             const placeholders = keys.map(() => '?').join(',');
//             const sql = `INSERT INTO stats (${keys.join(',')}) VALUES (${placeholders})`;
            
//             db.run(sql, Object.values(processedData), function(err) {
//                 if (err) reject(err);
//                 else resolve();
//             });
//         });
//     });
// }

// function getData(columns = ['*'], conditions = {}) {
//     return new Promise((resolve, reject) => {
//         const where = Object.keys(conditions).length ? 
//             'WHERE ' + Object.entries(conditions)
//                 .map(([k, v]) => `${k} = ?`)
//                 .join(' AND ') : '';
                
//         const sql = `SELECT ${columns.join(',')} FROM stats ${where}`;
        
//         db.all(sql, Object.values(conditions), (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// }

// module.exports = {
//     db,
//     addData,
//     addColumn,
//     getData
// };