import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Todo from "@/models/Todo";
import Notification from "@/models/Notification";

// Configured for Vercel Cron or standard HTTP GET invocation
export async function GET(req: Request) {
  try {
    // Basic security block if you define CRON_SECRET in .env
    const authHeader = req.headers.get("Authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized cron invocation" }, { status: 401 });
    }

    await connectToDatabase();
    const now = new Date();

    // Time calculations
    const in3HoursMin = new Date(now.getTime() + 175 * 60000); // 2h 55m
    const in3HoursMax = new Date(now.getTime() + 185 * 60000); // 3h 5m
    
    const in10MinsMin = new Date(now.getTime() + 5 * 60000); // 5m
    const in10MinsMax = new Date(now.getTime() + 15 * 60000); // 15m

    // Find todos ~3 hours away
    const todos3h = await Todo.find({
      status: "pending",
      notified3h: false,
      deadline: { $gte: in3HoursMin, $lte: in3HoursMax }
    });

    for (const todo of todos3h) {
      await Notification.create({
        userId: todo.userId,
        title: "Task Due Soon",
        message: `Your task "${todo.title}" is due in approximately 3 hours.`,
        todoId: todo._id,
      });
      todo.notified3h = true;
      await todo.save();
      console.log(`[Push Sim] Sent 3h notification to user ${todo.userId} for task ${todo._id}`);
      
      // NOTE TO REACT NATIVE DEV:
      // Insert actual push notification triggers here (e.g. Firebase Admin sendToDevice)
    }

    // Find todos ~10 minutes away
    const todos10m = await Todo.find({
      status: "pending",
      notified10m: false,
      deadline: { $gte: in10MinsMin, $lte: in10MinsMax }
    });

    for (const todo of todos10m) {
      await Notification.create({
        userId: todo.userId,
        title: "Task Deadline Imminent!",
        message: `Your task "${todo.title}" is due in 10 minutes!`,
        todoId: todo._id,
      });
      todo.notified10m = true;
      await todo.save();
      console.log(`[Push Sim] Sent 10m notification to user ${todo.userId} for task ${todo._id}`);
      
      // NOTE TO REACT NATIVE DEV:
      // Insert actual push notification triggers here (e.g. Firebase Admin sendToDevice)
    }

    return NextResponse.json({ 
      success: true, 
      processed3h: todos3h.length,
      processed10m: todos10m.length 
    });
  } catch (error) {
    console.error("Cron Error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
