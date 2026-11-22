import fs from "fs";
import { NextResponse } from "next/server";
import { ALL_SCOPES, type ContentScope } from "@/lib/types";
import {
  getMimeTypeFromFilename,
  resolveUploadedFilePath,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ scope: string; filename: string }> }
) {
  const { scope, filename } = await context.params;

  if (!ALL_SCOPES.includes(scope as ContentScope)) {
    return NextResponse.json({ error: "Sección inválida." }, { status: 400 });
  }

  const decodedName = decodeURIComponent(filename);
  const filePath = resolveUploadedFilePath(scope as ContentScope, decodedName);

  if (!filePath) {
    return NextResponse.json(
      { error: "Archivo no encontrado." },
      { status: 404 }
    );
  }

  const buffer = fs.readFileSync(filePath);
  const contentType = getMimeTypeFromFilename(decodedName);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "Content-Disposition": `inline; filename="${decodedName.replace(/"/g, "")}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
