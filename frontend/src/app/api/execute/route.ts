import { NextRequest, NextResponse } from 'next/server';
import { createContext, runInNewContext } from 'vm';

export interface ExecutionResult {
  success: boolean;
  output: string;
  steps: Array<{
    line: number;
    description: string;
    variables: Record<string, any>;
  }>;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { code, input } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Kod gerekli' },
        { status: 400 }
      );
    }

    let output = '';
    const steps: Array<{ line: number; description: string; variables: Record<string, any> }> = [];

    // Sandbox context oluştur
    const context = createContext({
      input: input || [64, 34, 25, 12, 22, 11, 90],
      console: {
        log: (...args: any[]) => {
          output += args.map(arg => {
            if (typeof arg === 'object') {
              return JSON.stringify(arg);
            }
            return String(arg);
          }).join(' ') + '\n';
        }
      },
      // Temel matematik fonksiyonları
      Math: Math,
      JSON: JSON,
      Array: Array,
      Object: Object,
      Number: Number,
      String: String,
      Boolean: Boolean,
      Date: Date,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
    });

    // Timeout ile çalıştır (5 saniye)
    const script = code;
    
    try {
      runInNewContext(script, context, {
        timeout: 5000,
        displayErrors: true,
      });
    } catch (execError) {
      return NextResponse.json({
        success: false,
        output,
        steps,
        error: `Çalışma hatası: ${execError instanceof Error ? execError.message : String(execError)}`,
        executionTime: Date.now() - startTime
      });
    }

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      output: output || 'Kod çalıştırıldı (çıktı yok)',
      steps,
      executionTime
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      output: '',
      steps: [],
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      executionTime: Date.now() - startTime
    }, { status: 500 });
  }
}