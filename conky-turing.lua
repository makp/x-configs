conky.config = {
-- The script in myscripts is pointing to this file. No need to symlink.
   alignment = 'top_left',
   gap_x = 2565,
   xftalpha = 0.8,

   -- options for preventing flickering
   double_buffer = true,-- double-buffer extension (DBE) support -- update window fast enough
   own_window = true,

   -- font
   use_xft = true,
   font = 'DejaVu Sans Book:size=6',

   -- windows settings
   own_window_type = 'override',
   -- another possible value is "desktop"
   own_window_transparent = true,
   own_window_hints = 'undecorated,below,sticky,skip_taskbar,skip_pager',

   draw_shades = false,
   draw_outline = false,
   draw_borders = false,
   stippled_borders = 1,
   --border_margin 1
   border_width = 1,
   default_shade_color = 'black',
   default_outline_color = 'black',

   use_spacer = 'none',
   no_buffers = true,
   uppercase = false,
   update_interval = 3,-- seconds

   maximum_width = 300,-- pixels

   -- colors
   default_color = '#BADCDD',
   color1 = 'gray23',-- #   # net
   color3 = '#698b22',-- ram
   color2 = '#365411',-- cpu
   color4 = 'darkorange4',
   color5 = '#9F9F1A',-- yellowish
   color6 = 'dodgerblue4',-- weather
   -- 3b6113

   color7 = 'yellow',-- system management
};

conky.text = [=[
${color gray7}${font OpenLogos:size=28}   t  B  U  z
 ${color1}${font PizzaDude Bullets:size=16}M${font} Up: ${upspeed wlp8s0}${color1}
   ${upspeedgraph wlp8s0 20 000000 ffffff}
   ${font PizzaDude Bullets:size=16}S${font} Down: ${downspeed wlp8s0}
   ${downspeedgraph wlp8s0 20 darkred white}
   wi-fi signal: ${wireless_link_qual_perc wlp8s0} % ${wireless_link_bar wlp8s0}

   ${color 293d3d}${font StyleBats:size=16}l${font} Load: ${loadavg}
    ${loadgraph 20 000000 ffffff yellow -t}

   ${color2}${font PizzaDude Bullets:size=16}J${font} Processes: $running_processes / $processes
     ${hr 2}
     HIGHEST MEM:
     ${color darkred}${top_mem name 1}${top_mem mem 1}
     ${color2}${top_mem name 2}${top_mem mem 2}
     ${top_mem name 3}${top_mem mem 3}
     ${hr 2}

     ${hr 2}
     HIGHEST CPU:
     ${color darkred}${top name 1}${top cpu 1}
     ${color2}${top name 2}${top cpu 2}
     ${top name 3}${top cpu 3}
     ${hr 2}
     # freq (MHz): ${freq 1} (core 0)  ${freq 2} (core 1) ${freq 3} (core 2) ${freq 4} (core 3)

   # ${color yellow3}${font StyleBats:size=16}
 ${color 10470e}${font StyleBats:size=16}A${font} CPU: ${hwmon 0 temp 1} C; Gov.: ${execi 5 head /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor}
    ${cpugraph 20 000000 ffffff}
     Core 0: ${cpubar cpu0 7,145} ${freq 1}MHz ${cpu cpu0}%
     Core 1: ${cpubar cpu1 7,145} ${freq 2}MHz ${cpu cpu1}%
     Core 2: ${cpubar cpu2 7,145} ${freq 3}MHz ${cpu cpu2}%
     Core 3: ${cpubar cpu3 7,145} ${freq 4}MHz ${cpu cpu3}%
     Core 4: ${cpubar cpu4 7,145} ${freq 5}MHz ${cpu cpu4}%
     Core 5: ${cpubar cpu5 7,145} ${freq 6}MHz ${cpu cpu5}%
     Core 6: ${cpubar cpu6 7,145} ${freq 7}MHz ${cpu cpu6}%
     
    ${color 234010}${font StyleBats:size=14}C${font} GPU: ${nvidia modelname}
     ${nvidiabar 7,245 gpuutil} ${nvidia gpuutil}%
    Temp: ${nvidia gputemp}/${nvidia gputempthreshold} C Refresh Rate: ${execi 5 xrandr | grep -A1 DP-4 | grep -o "[[:digit:]]\+.[[:digit:]]\+\*" | grep -o "[[:digit:]]\+.[[:digit:]]\+"}Hz


    ${color5}${font StyleBats:size=18}m${font} Memory & SSD
     RAM: $mem / $memmax
     ${membar 6}
     Swap: $swap/$swapmax
     ${swapbar 6}
     SSD: ${fs_free /} / ${fs_size /}
     ${fs_bar /}

   ${color7}${font StyleBats:size=18}o${font} Uptime: ${uptime_short} (Linux $kernel)
       
     ${color white}${font Radio Space:size=16}${time %A %d %Y}
             ${font Radio Space:size=40}${time %H:%M}
]=];
