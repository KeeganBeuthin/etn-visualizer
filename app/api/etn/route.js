// app/api/etn/route.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${start}&period2=${end}&interval=1d&events=history`
    );
    return new NextResponse(response.data, { status: 200 });
  } catch (error) {
    return new NextResponse("Error fetching data from Yahoo Finance", {
      status: 500,
    });
  }
}
