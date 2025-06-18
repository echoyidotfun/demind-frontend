import { NextRequest, NextResponse } from "next/server";

// 从环境变量获取agent服务URL
const AGENT_SERVICE_URL = process.env.NEXT_PUBLIC_AGENT_SERVICE_URL;

// 使用Edge Runtime以获得更好的流式处理能力
export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // 获取路由参数，先await整个params对象，然后再访问path属性
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");

    // 从URL获取查询参数
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();

    // 复制所有查询参数，但排除可能导致路径冲突的参数
    url.searchParams.forEach((value, key) => {
      if (key !== "path") {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const targetUrl = `${AGENT_SERVICE_URL}/api/v1/stream/${path}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(`Proxying SSE request to: ${targetUrl}`);

    // 创建headers副本（排除host和connection等特定header）
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // 排除特定的headers，它们会自动由fetch设置或者可能导致问题
      if (
        !["host", "connection", "content-length"].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // 设置SSE相关headers
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    // 发送代理请求
    const response = await fetch(targetUrl, {
      headers,
      method: request.method,
      // 重要：SSE需要保持连接开启
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Proxy error: Target responded with ${response.status}`);
      return new NextResponse(
        JSON.stringify({ error: `Target responded with ${response.status}` }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 验证响应是否为流
    if (!response.body) {
      console.error("Proxy error: No response body from target");
      return new NextResponse(
        JSON.stringify({ error: "No response body from target" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 返回流式响应
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // 允许所有来源，这是开发环境下的设置，生产环境应该更严格
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to proxy request",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// 处理POST请求（例如终止操作）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // 获取路由参数，先await整个params对象，然后再访问path属性
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");

    // 从URL获取查询参数
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();

    // 复制所有查询参数，但排除可能导致路径冲突的参数
    url.searchParams.forEach((value, key) => {
      if (key !== "path") {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const targetUrl = `${AGENT_SERVICE_URL}/api/v1/stream/${path}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(`Proxying POST request to: ${targetUrl}`);

    // 获取请求body
    let body: string | undefined;
    try {
      body = await request.text();
    } catch (e) {
      console.log("No request body or error reading it");
    }

    // 创建headers副本
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (
        !["host", "connection", "content-length"].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // 发送代理请求
    const response = await fetch(targetUrl, {
      headers,
      method: "POST",
      body: body || undefined,
      cache: "no-store",
    });

    // 返回响应
    const responseData = await response.json();
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request", details: (error as Error).message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// 添加OPTIONS请求处理以支持CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
