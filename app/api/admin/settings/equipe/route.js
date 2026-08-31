import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const EQUIPE_FILE = path.join(DATA_DIR, 'settings_equipe.json');
const REJOIGNEZ_FILE = path.join(DATA_DIR, 'settings_rejoignez.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function GET(req) {
  try {
    ensureDataDir();
    
    let equipeSettings = null;
    let rejoignezSettings = null;

    if (fs.existsSync(EQUIPE_FILE)) {
      equipeSettings = JSON.parse(fs.readFileSync(EQUIPE_FILE, 'utf8'));
    }
    if (fs.existsSync(REJOIGNEZ_FILE)) {
      rejoignezSettings = JSON.parse(fs.readFileSync(REJOIGNEZ_FILE, 'utf8'));
    }

    return NextResponse.json({
      equipeSettings,
      rejoignezSettings
    });
  } catch (error) {
    console.error('Error reading settings API:', error);
    return NextResponse.json({ error: 'Erreur lors de la lecture de la configuration' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    ensureDataDir();
    const body = await req.json();
    const { type, settings } = body; // type: 'equipe' | 'rejoignez'

    if (type === 'equipe') {
      fs.writeFileSync(EQUIPE_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } else if (type === 'rejoignez') {
      fs.writeFileSync(REJOIGNEZ_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } else {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing settings API:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde de la configuration' }, { status: 500 });
  }
}
