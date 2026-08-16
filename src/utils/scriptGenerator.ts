import { BotSettings, ScreenCoordinate } from '../types';

export function generateAHKScript(settings: BotSettings, coords: ScreenCoordinate[]): string {
  const getCoord = (id: string, fallbackX: number, fallbackY: number) => {
    const found = coords.find(c => c.id === id);
    return found ? { x: found.x, y: found.y } : { x: fallbackX, y: fallbackY };
  };

  const watchtower = getCoord('watchtower_btn', 1298, 382);
  const searchCryptsTab = getCoord('search_tab_crypts', 520, 220);
  const minSlider = getCoord('level_min_slider', 595, 295);
  const maxSlider = getCoord('level_max_slider', 765, 295);
  const rareCheckbox = getCoord('rare_filter_checkbox', 642, 355);
  const searchBtn = getCoord('search_action_btn', 680, 418);
  const firstResult = getCoord('first_result_item', 680, 495);
  const exploreBtn = getCoord('explore_go_btn', 825, 495);
  const marchSend = getCoord('march_send_btn', 865, 658);
  const staminaPotion = getCoord('stamina_potion_use_btn', 680, 472);
  const closeModal = getCoord('close_modal_btn', 1045, 135);

  const captainSlots = [
    getCoord('captain_slot_1', 460, 375),
    getCoord('captain_slot_2', 548, 375),
    getCoord('captain_slot_3', 636, 375),
    getCoord('captain_slot_4', 724, 375),
    getCoord('captain_slot_5', 812, 375),
    getCoord('captain_slot_6', 900, 375),
  ].slice(0, settings.activeCaptainIds.length || 3);

  const captainSlotsAHK = captainSlots
    .map((c, i) => `    Captains[${i + 1}] := {x: ${c.x}, y: ${c.y}}`)
    .join('\n');

  return `; ==============================================================================
; Crypt Rider Pro (Total Battle Helper) - AutoHotkey v2 Automation Script
; Target Monitor Resolution: 1360 x 768 (Calibrated)
; Hotkeys:
;   [F10] : Start Crypt Exploration Loop
;   [F11] : Pause / Resume
;   [F12] : Emergency Exit / Stop Script
; ==============================================================================
#Requires AutoHotkey v2.0
#SingleInstance Force
CoordMode "Mouse", "Screen"
CoordMode "ToolTip", "Screen"
SetDefaultMouseSpeed 2

global IsRunning := false
global IsPaused := false
global CurrentCaptainIdx := 1
global TotalCaptains := ${captainSlots.length}
global CryptsExplored := 0
global MinDelay := ${settings.delayMinMs || 250}
global MaxDelay := ${settings.delayMaxMs || 450}

; Coordinates Matrix Calibrated for 1360x768
global WatchtowerBtn := {x: ${watchtower.x}, y: ${watchtower.y}}
global CryptsTab     := {x: ${searchCryptsTab.x}, y: ${searchCryptsTab.y}}
global MinLevelBox   := {x: ${minSlider.x}, y: ${minSlider.y}}
global MaxLevelBox   := {x: ${maxSlider.x}, y: ${maxSlider.y}}
global RareFilter    := {x: ${rareCheckbox.x}, y: ${rareCheckbox.y}}
global SearchBtn     := {x: ${searchBtn.x}, y: ${searchBtn.y}}
global ResultCard    := {x: ${firstResult.x}, y: ${firstResult.y}}
global ExploreBtn    := {x: ${exploreBtn.x}, y: ${exploreBtn.y}}
global MarchSendBtn  := {x: ${marchSend.x}, y: ${marchSend.y}}
global PotionBtn     := {x: ${staminaPotion.x}, y: ${staminaPotion.y}}
global CloseBtn      := {x: ${closeModal.x}, y: ${closeModal.y}}

global Captains := []
${captainSlotsAHK}

; --- HOTKEYS ---
F10:: {
    global IsRunning, IsPaused
    if (!IsRunning) {
        IsRunning := true
        IsPaused := false
        ToolTip "⚡ Crypt Rider (1360x768): BOT STARTED", 20, 20
        SetTimer MainBotLoop, 500
    }
}

F11:: {
    global IsPaused, IsRunning
    if (IsRunning) {
        IsPaused := !IsPaused
        if (IsPaused) {
            ToolTip "⏸️ Crypt Rider: PAUSED (Press F11 to Resume)", 20, 20
        } else {
            ToolTip "▶️ Crypt Rider: RESUMED", 20, 20
        }
    }
}

F12:: {
    ToolTip "🛑 Crypt Rider: TERMINATED", 20, 20
    Sleep 1000
    ExitApp
}

; --- HUMANIZED RANDOM CLICKER ---
HumanClick(x, y, label := "") {
    global MinDelay, MaxDelay
    if (label != "") {
        ToolTip "🎯 Action: " label " -> [" x ", " y "]", 20, 20
    }
    ; Jitter click slightly +/- 2 pixels to simulate human hand
    jitterX := x + Random(-2, 2)
    jitterY := y + Random(-2, 2)
    MouseMove jitterX, jitterY, Random(2, 5)
    Sleep Random(60, 120)
    Click
    Sleep Random(MinDelay, MaxDelay)
}

; --- MAIN AUTOMATION CYCLE ---
MainBotLoop() {
    global IsRunning, IsPaused, CurrentCaptainIdx, TotalCaptains, CryptsExplored

    if (!IsRunning || IsPaused) {
        return
    }

    ; Step 1: Open Watchtower
    HumanClick(WatchtowerBtn.x, WatchtowerBtn.y, "Open Watchtower")
    Sleep Random(600, 900)

    ; Step 2: Select Crypts Tab
    HumanClick(CryptsTab.x, CryptsTab.y, "Select Crypts Tab")
    Sleep Random(350, 600)

    ${
      settings.rarities.rare || settings.rarities.epic
        ? `
    ; Step 3: Ensure Rare/Epic Filter is set
    HumanClick(RareFilter.x, RareFilter.y, "Toggle Rare Crypt Filter")
    Sleep Random(250, 450)
    `
        : ''
    }

    ; Step 4: Click Search
    HumanClick(SearchBtn.x, SearchBtn.y, "Search Crypts")
    Sleep Random(800, 1200)

    ; Step 5: Click first search result
    HumanClick(ResultCard.x, ResultCard.y, "Select Found Crypt")
    Sleep Random(400, 700)

    ; Step 6: Click Go to / Explore
    HumanClick(ExploreBtn.x, ExploreBtn.y, "Explore Crypt Target")
    Sleep Random(700, 1100)

    ; Step 7: Select Captain slot (Rotate ${captainSlots.length} captains)
    cap := Captains[CurrentCaptainIdx]
    HumanClick(cap.x, cap.y, "Select Captain #" CurrentCaptainIdx)
    Sleep Random(400, 650)

    ; Step 8: Send March
    HumanClick(MarchSendBtn.x, MarchSendBtn.y, "Dispatch March")
    Sleep Random(600, 950)

    ${
      settings.autoStaminaPotion
        ? `
    ; Step 9: Check & Auto-Refill Stamina Potion if prompted
    HumanClick(PotionBtn.x, PotionBtn.y, "Check Stamina Potion")
    Sleep Random(300, 500)
    `
        : ''
    }

    ; Close any leftover popup
    HumanClick(CloseBtn.x, CloseBtn.y, "Safe Clear Dialog")

    CryptsExplored++
    CurrentCaptainIdx++
    if (CurrentCaptainIdx > TotalCaptains) {
        CurrentCaptainIdx := 1
    }

    ToolTip "⚔️ Crypt Rider (1360x768) | Crypts: " CryptsExplored " | Next Captain: #" CurrentCaptainIdx, 20, 20
    
    ; Delay between captain cycles
    Sleep Random(3500, 6000)
}
`;
}

export function generatePythonScript(settings: BotSettings, coords: ScreenCoordinate[]): string {
  const getCoord = (id: string, fallbackX: number, fallbackY: number) => {
    const found = coords.find(c => c.id === id);
    return found ? { x: found.x, y: found.y } : { x: fallbackX, y: fallbackY };
  };

  const watchtower = getCoord('watchtower_btn', 1298, 382);
  const searchCryptsTab = getCoord('search_tab_crypts', 520, 220);
  const searchBtn = getCoord('search_action_btn', 680, 418);
  const firstResult = getCoord('first_result_item', 680, 495);
  const exploreBtn = getCoord('explore_go_btn', 825, 495);
  const marchSend = getCoord('march_send_btn', 865, 658);
  const staminaPotion = getCoord('stamina_potion_use_btn', 680, 472);
  const closeModal = getCoord('close_modal_btn', 1045, 135);

  return `# ==============================================================================
# Crypt Rider Pro (Total Battle Helper) - Python 3 Automation Bot
# Calibrated for 1360 x 768 Monitor Resolution
# Requirements: pip install pyautogui pynput keyboard
# Hotkeys: [F10] Start | [F11] Pause | [F12] Emergency Stop
# ==============================================================================
import time
import random
import threading
import sys

try:
    import pyautogui
    import keyboard
except ImportError:
    print("Please install dependencies: pip install pyautogui keyboard")
    sys.exit(1)

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.05

is_running = False
is_paused = False
crypts_cleared = 0
current_captain = 1
total_captains = ${settings.activeCaptainIds.length || 3}

COORDS = {
    'watchtower': (${watchtower.x}, ${watchtower.y}),
    'crypts_tab': (${searchCryptsTab.x}, ${searchCryptsTab.y}),
    'search_btn': (${searchBtn.x}, ${searchBtn.y}),
    'result_card': (${firstResult.x}, ${firstResult.y}),
    'explore_btn': (${exploreBtn.x}, ${exploreBtn.y}),
    'march_send': (${marchSend.x}, ${marchSend.y}),
    'stamina_potion': (${staminaPotion.x}, ${staminaPotion.y}),
    'close_btn': (${closeModal.x}, ${closeModal.y}),
}

CAPTAIN_SLOTS = [
    (460, 375), (548, 375), (636, 375), (724, 375), (812, 375), (900, 375)
][:total_captains]

def human_click(pos, label=""):
    x, y = pos
    # Humanized jitter +/- 2px
    jx = x + random.randint(-2, 2)
    jy = y + random.randint(-2, 2)
    print(f"[ACTION] {label} -> ({jx}, {jy})")
    pyautogui.moveTo(jx, jy, duration=random.uniform(0.15, 0.35))
    time.sleep(random.uniform(0.05, 0.12))
    pyautogui.click()
    time.sleep(random.uniform(${settings.delayMinMs / 1000}, ${settings.delayMaxMs / 1000}))

def bot_loop():
    global is_running, is_paused, crypts_cleared, current_captain
    print("⚡ Crypt Rider Pro (1360x768) Engine Activated. Press F11 to Pause, F12 to Stop.")
    
    while is_running:
        if is_paused:
            time.sleep(0.5)
            continue

        try:
            # 1. Open Watchtower
            human_click(COORDS['watchtower'], "Open Watchtower")
            time.sleep(random.uniform(0.7, 1.1))

            # 2. Select Crypts Tab
            human_click(COORDS['crypts_tab'], "Select Crypts Tab")
            time.sleep(random.uniform(0.4, 0.6))

            # 3. Search Crypts
            human_click(COORDS['search_btn'], "Click Search")
            time.sleep(random.uniform(0.9, 1.3))

            # 4. Select top result
            human_click(COORDS['result_card'], "Select Target Crypt")
            time.sleep(random.uniform(0.4, 0.7))

            # 5. Explore
            human_click(COORDS['explore_btn'], "Explore Crypt")
            time.sleep(random.uniform(0.7, 1.0))

            # 6. Select Captain
            cap_pos = CAPTAIN_SLOTS[(current_captain - 1) % len(CAPTAIN_SLOTS)]
            human_click(cap_pos, f"Select Captain #{current_captain}")
            time.sleep(random.uniform(0.4, 0.6))

            # 7. Send March
            human_click(COORDS['march_send'], "Send March")
            time.sleep(random.uniform(0.6, 0.9))

            ${
              settings.autoStaminaPotion
                ? `
            # 8. Check Stamina Refill
            human_click(COORDS['stamina_potion'], "Check Stamina Potion")
            time.sleep(random.uniform(0.3, 0.5))
            `
                : ''
            }

            # 9. Clean modal
            human_click(COORDS['close_btn'], "Close / Clear")

            crypts_cleared += 1
            current_captain = (current_captain % total_captains) + 1
            print(f"✅ Crypt #{crypts_cleared} march sent! Next Captain: #{current_captain}")

            # Sleep between dispatches
            time.sleep(random.uniform(3.5, 6.0))

        except Exception as e:
            print(f"⚠️ Error during cycle: {e}")
            time.sleep(1)

def toggle_start():
    global is_running
    if not is_running:
        is_running = True
        t = threading.Thread(target=bot_loop, daemon=True)
        t.start()

def toggle_pause():
    global is_paused
    is_paused = not is_paused
    state = "PAUSED" if is_paused else "RESUMED"
    print(f"⏸️ Crypt Rider: {state}")

def stop_bot():
    global is_running
    print("🛑 Crypt Rider Terminated by user (F12).")
    is_running = False
    sys.exit(0)

if __name__ == "__main__":
    print("=================================================================")
    print("   CRYPT RIDER PRO - TOTAL BATTLE AUTOMATION (1360 x 768)        ")
    print("   [F10] = Start   |   [F11] = Pause   |   [F12] = Stop          ")
    print("=================================================================")
    keyboard.add_hotkey('f10', toggle_start)
    keyboard.add_hotkey('f11', toggle_pause)
    keyboard.add_hotkey('f12', stop_bot)
    keyboard.wait('f12')
`;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
