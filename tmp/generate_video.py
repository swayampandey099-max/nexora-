import os
import subprocess

os.makedirs('/tmp/frames', exist_ok=True)

# 5 clips, 1.2 seconds each = 6.0 seconds total at 15 fps = 90 frames
fps = 15
total_scenes = 5
frames_per_scene = 18

scenes = [
    {
        "masthead": "THE INQUIRER & GAZETTE",
        "sub": "City Affairs & Special Investigation",
        "headline_before": "‘An expert was ",
        "highlight": "Artificial Intelligence",
        "headline_after": " consulted. The lawyer was also confused’",
        "body_lines_top": [
            "A second row was also confused. Nobody mentioned that until now. A pigeon was briefly detained. It offered no statement.",
            "not visible to anyone. Experts called the situation ‘not ideal’ and left. The permit, it turns out, was never filed. Nobody was",
            "received a reply. The mayor denied everything and then left the building. A local man claimed responsibility. Police are not",
            "convinced. The email was sent to everyone, including the people it was about. The dog was fine. Nobody had asked about the dog.",
            "Authorities are agreeing, which is not helping. The meeting was rescheduled four times and then cancelled. Nobody signed,",
            "which surprised everyone, including the board. After the receipt was reviewed, the matter remained unchanged. A van was seen",
            "leaving at speed. It was beige. Nobody was surprised. An official inquiry was opened, but the file was misplaced. Still no comment."
        ],
        "body_lines_bottom": [
            "Twice, nobody wrote it down. Sources say it was always like this. The permit, it turns out, was never filed. Nobody was",
            "questioned further. Dispatches from local residents indicate minor confusion. A spokesperson called the event ‘routine,’ but",
            "nobody could explain the second part. The meeting was rescheduled four times and then cancelled. Local residents expressed",
            "quiet reservation. When asked for clarity, officials confirmed the draft report was twenty-three pages long. No one read it.",
            "Later, police arrived three hours later. They had sandwiches. It turned out the license had expired in 2019. The mayor was unavailable."
        ]
    },
    {
        "masthead": "THE REGIONAL MURMUR",
        "sub": "Our regional weekly dispatch for the two towns · Crime & Nonsense Desk",
        "headline_before": "‘",
        "highlight": "Artificial Intelligence",
        "headline_after": ",’ confirms spokesperson",
        "body_lines_top": [
            "Her publicist said she is resting and reflecting on the experience. The corporation released a statement. Nobody read it.",
            "Sources say they were told there was an inquiry. A van was seen leaving at speed. It was beige. The status has been",
            "removed pending further discussion. Witnesses disagree on basically everything. Officials confirmed the smell was not ideal.",
            "A full refund was promised to some of the affected customers. Witnesses said they heard a quiet hum from the server room.",
            "The document was ninety pages and solved nothing. Experts called the situation ‘standard practice’ and ordered coffee."
        ],
        "body_lines_bottom": [
            "was mentioned briefly and then not mentioned again. The report is nineteen pages and solves nothing. The dog was fine. Nobody",
            "ongoing, apparently. Sources say they were told there were no answers. A pigeon was briefly detained. It offered no statement.",
            "and solves nothing. Local residents were surprised but not shocked. Mostly not shocked.",
            "Twice, nobody wrote it down. Sources say it was always like this. The permit, it turns out, was never filed. Nobody was",
            "questioned further. Dispatches from local residents indicate minor confusion. A spokesperson called the event ‘routine.’"
        ]
    },
    {
        "masthead": "THE MORNING CHRONICLE",
        "sub": "Provincial Edition · Volume 84 · Daily Dispatch",
        "headline_before": "‘Local residents were surprised but not skeptical. ",
        "highlight": "Artificial Intelligence",
        "headline_after": " shocked. Mostly not shocked’",
        "body_lines_top": [
            "resigned to spend more time with his investments. A full refund was promised to some of the affected customers.",
            "Nobody was surprised. An official inquiry was opened, but the file was misplaced. Twice, nobody wrote it down.",
            "permit, it turns out, was never filed. Local residents were surprised but not shocked. Mostly not shocked. No one was",
            "asked to leave. Dispatches from local residents indicate minor confusion. A spokesperson called the event ‘routine.’",
            "It was announced. It had happened twice before. CCTV footage was reviewed. Officers are reviewing it slowly. Sources",
            "say it was always like this. The app was updated in 2022. Twelve complaints were lodged. Nobody signed, which surprised everyone."
        ],
        "body_lines_bottom": [
            "the status has been removed pending further discussion. The matter is not routine. Most of it eventually. A full refund",
            "was promised to some of the affected customers. Witnesses said they heard a quiet hum. A spokesperson had been contacted,",
            "although no statement was ready. The status has been removed pending further discussion. The matter was described as routine."
        ]
    },
    {
        "masthead": "THE EVENING STANDARD",
        "sub": "Late City Edition · Tech & Society Section",
        "headline_before": "",
        "highlight": "Artificial Intelligence",
        "headline_after": ": still ongoing",
        "body_lines_top": [
            "The second row was also confused. Nobody mentioned that until now. A pigeon was briefly detained. It offered no statement.",
            "not visible to anyone. Experts called the situation ‘not ideal’ and left. The permit, it turns out, was never filed. Nobody was",
            "received a reply. The mayor denied everything and then left the building. A local man claimed responsibility. Police are not",
            "convinced. The email was sent to everyone, including the people it was about. The dog was fine. Nobody had asked about the dog.",
            "Authorities are agreeing, which is not helping. The meeting was rescheduled four times and then cancelled. Nobody signed,",
            "which surprised everyone, including the board. After the receipt was reviewed, the matter remained unchanged. A van was seen"
        ],
        "body_lines_bottom": [
            "leaving at speed. It was beige. Nobody was surprised. An official inquiry was opened, but the file was misplaced. Still no comment.",
            "Twice, nobody wrote it down. Sources say it was always like this. The permit, it turns out, was never filed. Nobody was",
            "questioned further. Dispatches from local residents indicate minor confusion. A spokesperson called the event ‘routine,’ but",
            "nobody could explain the second part. The meeting was rescheduled four times and then cancelled. Local residents expressed",
            "quiet reservation. When asked for clarity, officials confirmed the draft report was twenty-three pages long. No one read it."
        ]
    },
    {
        "masthead": "SAN ANDREAS CHRONICLE",
        "sub": "A public company statement was drafted. A spokesperson had been contacted.",
        "headline_before": "Man sues city over ",
        "highlight": "Artificial Intelligence",
        "headline_after": ". Loses. Appeals.",
        "body_lines_top": [
            "A local man claims responsibility. Police are not convinced. The email was sent to everyone, including the people it was about.",
            "The building had been there for years. Nobody said anything. The dog was fine. Nobody had asked about the dog. The report is",
            "nineteen pages and solves nothing. Authorities are agreeing, which is not helping. The meeting was rescheduled four times and",
            "then cancelled. Nobody signed, which surprised everyone, including the board. After the receipt was reviewed, the matter remained",
            "unchanged. A van was seen leaving at speed. It was beige. An official inquiry was opened, but the file was misplaced."
        ],
        "body_lines_bottom": [
            "statement. Nobody read it. Resigned ‘to spend more time with his investments.’ A van was mentioned briefly and then not mentioned again.",
            "It was beige. The status has been removed pending further discussion. The contractor failed for work that was so intricate. Witnesses disagree",
            "on basically everything. Officials confirmed the smell was not ideal and left. The contractor agreed to pay the sum. Nobody claimed the trophy.",
            "The trophies are missing. We kept the trophy. It was large. It had letters. Nobody wrote it down. An audit was mentioned. Twleve people filed",
            "complaints. One received a reply. The dog was fine. Nobody had asked about the dog. The email was sent to everyone."
        ]
    }
]

frame_idx = 0

for s_idx, scene in enumerate(scenes):
    for f in range(frames_per_scene):
        # Calculate highlighter progress (sweeps across in first 8 frames, then stays)
        progress = min(1.0, f / 8.0)
        
        # Jitter/handheld camera drift
        offset_y = (f % 5) * 0.8
        offset_x = ((f * 3) % 7) * 0.5
        
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <!-- Paper texture gradient -->
    <linearGradient id="paperBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF9F4"/>
      <stop offset="50%" stop-color="#F5F3EB"/>
      <stop offset="100%" stop-color="#ECEAE0"/>
    </linearGradient>
    <filter id="slightBlur" x="0" y="0" width="100%" height="100%">
      <feGaussianBlur stdDeviation="0.4"/>
    </filter>
  </defs>

  <!-- Background newsprint paper -->
  <rect width="900" height="900" fill="url(#paperBg)"/>
  
  <!-- Subtle column divider lines -->
  <line x1="440" y1="40" x2="440" y2="860" stroke="#DDD9CE" stroke-width="0.8"/>
  <line x1="60" y1="210" x2="840" y2="210" stroke="#444138" stroke-width="2.5"/>
  <line x1="60" y1="216" x2="840" y2="216" stroke="#444138" stroke-width="0.8"/>

  <!-- Top newsprint body text (blurred slightly for depth) -->
  <g font-family="serif" font-size="11.5" fill="#666359" opacity="0.75" transform="translate({offset_x},{offset_y})">
'''
        # Render top body lines in 2 columns
        for idx, line in enumerate(scene["body_lines_top"]):
            y_pos = 55 + idx * 18
            svg += f'    <text x="60" y="{y_pos}">{line[:75]}</text>\n'
            svg += f'    <text x="460" y="{y_pos}">{line[75:150] if len(line)>75 else line[:75]}</text>\n'

        svg += f'''  </g>

  <!-- Masthead -->
  <g font-family="serif" text-anchor="middle" transform="translate(450, 255)">
    <text font-size="28" font-weight="900" letter-spacing="4" fill="#1C1B18">{scene["masthead"]}</text>
    <text y="24" font-size="11" font-style="italic" fill="#5A574E" letter-spacing="0.5">{scene["sub"]}</text>
  </g>

  <!-- Headline Section with Animated Light Yellow Highlighter -->
  <g transform="translate(60, 340)">
'''
        # Full headline
        hl_before = scene["headline_before"]
        hl_target = scene["highlight"]
        hl_after = scene["headline_after"]

        # Highlighter rect behind the keyword
        # Compute approximate x offset for target
        x_before_len = len(hl_before) * 17.5
        target_width = len(hl_target) * 19.5 * progress

        svg += f'''    <!-- Animated Yellow Highlighter Stroke -->
    <rect x="{x_before_len - 6}" y="-34" width="{target_width + 12}" height="42" fill="#FDE047" opacity="0.9" rx="3" transform="rotate(-0.8 {x_before_len} -20)"/>
    
    <!-- Headline Text -->
    <text x="0" y="0" font-family="serif" font-size="34" font-weight="800" fill="#181816" letter-spacing="-0.5">
      <tspan fill="#181816">{hl_before}</tspan><tspan fill="#111110" font-weight="900">{hl_target}</tspan><tspan fill="#181816">{hl_after}</tspan>
    </text>
  </g>

  <!-- Bottom newsprint body text -->
  <line x1="60" y1="420" x2="840" y2="420" stroke="#CCC7B9" stroke-width="0.8"/>
  <g font-family="serif" font-size="12" fill="#3A3832" line-height="1.6" transform="translate({offset_x * 0.5},{offset_y * 0.5})">
'''
        for idx, line in enumerate(scene["body_lines_bottom"]):
            y_pos = 455 + idx * 24
            svg += f'    <text x="60" y="{y_pos}">{line[:65]}</text>\n'
            svg += f'    <text x="460" y="{y_pos}">{line[65:130] if len(line)>65 else line[:65]}</text>\n'

        # Additional bottom footer
        svg += f'''    <text x="60" y="830" font-size="10" font-style="italic" fill="#888478">Printed in the Autonomous Edition · Certified Public Ledger · Dispatch Archive No. {1042 + s_idx}</text>
  </g>
</svg>'''

        filename = f'/tmp/frames/frame_{frame_idx:04d}.svg'
        with open(filename, 'w') as f:
            f.write(svg)
        frame_idx += 1

print(f"Generated {frame_idx} SVG frames. Now encoding to MP4 with ffmpeg...")

# Encode frames into high quality MP4
cmd = [
    'ffmpeg', '-y',
    '-framerate', str(fps),
    '-i', '/tmp/frames/frame_%04d.svg',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'fast',
    '-movflags', '+faststart',
    '/public/ai_press_clippings.mp4'
]
subprocess.run(cmd, check=True)

# Also copy to src/assets
subprocess.run(['cp', '/public/ai_press_clippings.mp4', '/src/assets/ai_press_clippings.mp4'], check=True)
print("Video generated successfully at /public/ai_press_clippings.mp4 and /src/assets/ai_press_clippings.mp4!")
