// Exercise library. `joint` tells the pose engine which angle to track:
// squat-type reps track the knee, push-type reps track the elbow.
export const EXERCISES = [
  { id: "squat",    name: "Squat",          muscle: "Legs",      met: 5.5, joint: "knee",  cues: ["Chest up, brace your core", "Drive through your heels", "Knees track over toes"] },
  { id: "pushup",   name: "Push-up",        muscle: "Chest",     met: 4.5, joint: "elbow", cues: ["Body in one straight line", "Elbows at 45 degrees", "Full range — chest to floor"] },
  { id: "deadlift", name: "Deadlift",       muscle: "Back",      met: 6.0, joint: "knee",  cues: ["Hinge at the hips", "Bar close to your shins", "Lock out with glutes, not lower back"] },
  { id: "row",      name: "Bent-over Row",  muscle: "Back",      met: 5.0, joint: "elbow", cues: ["Flat back, hinge forward", "Pull elbow past your ribs", "Squeeze at the top"] },
  { id: "ohp",      name: "Overhead Press", muscle: "Shoulders", met: 5.0, joint: "elbow", cues: ["Glutes tight, ribs down", "Press slightly back over your head", "Full lockout"] },
  { id: "lunge",    name: "Lunge",          muscle: "Legs",      met: 4.8, joint: "knee",  cues: ["Long stride, torso tall", "Back knee kisses the floor", "Push through the front heel"] },
];
