const client = require('./client')

async function getRoutineActivityById(id){
  try{
    const {rows: [routine_activity]} = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id=${id};
    ` )
    return routine_activity;
} catch(error) {
  throw error
}
}
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
      console.log('in funciton', routineId)
      const {rows: [routine_activity]} = await client.query(`
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4) 
      RETURNING * ;
      `, [routineId, activityId, count, duration])
    
      return routine_activity
    }catch(error) {
      console.log("There was an error adding Activity to Routine")
      console.log(error)
      throw error
    }
}

async function getRoutineActivitiesByRoutine({id}) {
try {
const {rows: routine_activities} = await client.query(`
SELECT * FROM routine_activities
WHERE "routineId"=${id};
`)

return routine_activities
}catch(error) {
  throw error
}
}

async function updateRoutineActivity ({id, ...fields}) {
  console.log("I WAS CALLED")
  let keysArray = Object.keys(fields)

  let beforeString = keysArray.map((key, index) => `${key}=$${index+2}`)
  
  let setString = beforeString.join(', ')
  
 
  try {
    const {rows: [updatedRoutineActivity]} = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id=$1
    RETURNING *;
    `, [id, ...Object.values(fields)])
  
    return updatedRoutineActivity
  }catch(error) {
    console.log("There was an error updating Rouing Activity")
    console.log(error)
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {rows: [deletedRoutine]} = await client.query(`
    DELETE FROM routine_activities
    WHERE id=${id}
    RETURNING *;
    `)
    console.log("HERE", deletedRoutine)
    return deletedRoutine;
  }catch(error) {
    console.log("There was an error deleting the routine activity")
    console.log(error)
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    //Funciton isn't needed
const {rows: [routine]} = await client.query(`
SELECT routine_activities.*, routines."creatorId"
FROM 
routine_activities
JOIN routines
ON routine_activities."routineId"=routines.id
WHERE routine_activities.id=$1;
`, [routineActivityId])
console.log(routine)
if (routine.creatorId == userId) {
  return true
}else {
  return false
}
  }catch(error) {
    console.log("There was an error validating canEdiRoutineActiviy")
    console.log(error)
    throw error
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
