const sqlite = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, './data/db.sqlite');
const Debug = require('./helper/log.js');
const chalk = require('chalk');

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    Debug.log(chalk.blue('Connected to the database.'));

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
        Debug.log(chalk.blue('Adding data to database...'));
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
            processedData.CurrentWinStreak,
            processedData.Sessions,
            processedData.ExitStatus,
            processedData.LifeTime,
            processedData.Kills,
            processedData.Deaths,
            processedData.KilledBear,
            processedData.KilledUsec,
            processedData.KilledSavage,
            processedData.KilledPmc,
            processedData.KilledBoss,
            processedData.KilledWithKnife,
            processedData.KilledWithPistol,
            processedData.KilledWithSmg,
            processedData.KilledWithShotgun,
            processedData.KilledWithAssaultRifle,
            processedData.KilledWithAssaultCarbine,
            processedData.KilledWithGrenadeLauncher,
            processedData.KilledWithMachineGun,
            processedData.KilledWithMarksmanRifle,
            processedData.KilledWithSniperRifle,
            processedData.KilledWithSpecialWeapon,
            processedData.KilledWithThrowWeapon,
            processedData.KilledWithTripwires,
            processedData.HeadShots,
            processedData.BloodLoss,
            processedData.BodyPartsDestroyed,
            processedData.Heal,
            processedData.Fractures,
            processedData.Contusions,
            processedData.Dehydrations,
            processedData.Exhaustions,
            processedData.Medicines,
            processedData.BodiesLooted,
            processedData.SafeLooted,
            processedData.Weapons,
            processedData.Ammunitions,
            processedData.Mods,
            processedData.ThrowWeapons,
            processedData.SpecialItems,
            processedData.BartItems,
            processedData.CauseBodyDamage,
            processedData.CauseArmorDamage,
            processedData.HitCount,
            processedData.MoneyRUB,
            processedData.MoneyEUR,
            processedData.MoneyUSD,
            processedData.AmmoUsed,
            processedData.CombatDamage
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error inserting data:', err);
                reject(err);
            } else {
                Debug.log(chalk.blue('Data inserted successfully'));
                resolve();
            }
        });
    });
}

function processData(response) {
    const data = response.data;
    // Debug.log(chalk.red(`Debug: ${JSON.stringify(data.pmcStats.eft.overAllCounters.Items)}`));
    const extractedData = {
        id: data.id,
        nickname: data.info.nickname,
        exp: data.info.experience,
        totalInGameTime: data.pmcStats.eft.totalInGameTime,
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
        try {
            if (!body.stat) {
                throw new Error('stat parameter is required');
            }

            const requestedStats = Array.isArray(body.stat) ? body.stat : [body.stat];
            const startDate = body.startDate || '1970-01-01';
            const endDate = body.endDate || new Date().toISOString().split('T')[0];

            if (!isValidDate(startDate) || !isValidDate(endDate)) {
                throw new Error('Invalid date format. Use YYYY-MM-DD');
            }

            requestedStats.forEach(stat => {
                if (!validColumns.includes(stat)) {
                    throw new Error(`Invalid stat: ${stat}`);
                }
            });

            const sql = `
                SELECT 
                    datetime(date) as datetime,
                    nickname as player_name,
                    ${requestedStats.map(stat => `MAX(${stat}) as ${stat}`).join(', ')}
                FROM stats
                WHERE datetime(date) BETWEEN datetime(?) AND datetime(?)
                    AND nickname IS NOT NULL
                GROUP BY datetime(date), nickname
                ORDER BY datetime(date) ASC, nickname ASC
            `;

            const params = [`${startDate} 00:00:00`, `${endDate} 23:59:59`];

            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Query error:', err);
                    reject(err);
                    return;
                }

                if (!rows || rows.length === 0) {
                    resolve({
                        xAxis: {
                            type: "category",
                            boundaryGap: false,
                            data: []
                        },
                        legend: { data: [] },
                        series: []
                    });
                    return;
                }

                const formatDateTime = (datetime) => {
                    const date = new Date(datetime);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}:00`;
                };

                const datetimes = [...new Set(rows.map(row => formatDateTime(row.datetime)))];
                const playerNames = [...new Set(rows.map(row => row.player_name))];

                const series = requestedStats.flatMap(stat => 
                    playerNames.map(playerName => {
                        const playerData = rows.filter(row => row.player_name === playerName)
                            .reduce((acc, row) => {
                                acc[formatDateTime(row.datetime)] = row[stat];
                                return acc;
                            }, {});

                        return {
                            name: `${playerName} - ${stat}`,
                            data: datetimes.map(datetime => playerData[datetime] || 0)
                        };
                    })
                );

                resolve({
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: datetimes
                    },
                    legend: { data: series.map(s => s.name) },
                    series: series
                });
            });
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
}

function isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

module.exports = {
    db,
    addData,
    processData,
    getData,
    validColumns
};