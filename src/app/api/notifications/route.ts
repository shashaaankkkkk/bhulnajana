import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import { getHybridUser } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const notifications = await Notification.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getHybridUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const bodyText = await req.text();
    let notificationId = null;
    if (bodyText) {
      const body = JSON.parse(bodyText);
      notificationId = body.notificationId;
    }

    await connectToDatabase();
    
    if (notificationId) {
      await Notification.findOneAndUpdate({ _id: notificationId, userId: user.id }, { read: true });
    } else {
      await Notification.updateMany({ userId: user.id, read: false }, { read: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
