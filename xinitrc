#!/bin/sh
#
# ~/.xinitrc
#

WM="i3"

## loading .Xdefaults (if you have one) -----------
if [ -f $HOME/.Xdefaults ]; then
  xrdb -merge $HOME/.Xdefaults
fi

# disable trackpad while typing
syndaemon -t -k -i 2 -d &
# -i 2: sets the idle time to 2 seconds. The idle time specifies how many seconds after the last key-press before enabling touchpad again. 
# -t: tells the daemon not to disable mouse movement when typing and only disable tapping and scrolling
# -k: ignore modifier keys when monitoring keyboard activity
# -d: starts as a daemon

# Dvorak keyboard
setxkbmap dvorak &

# Xmodmap
xmodmap ~/.Xmodmap 

# space2ctrl
s2cctl start

# activating numlock X11
numlockx

# Xscreensaver
xscreensaver -no-splash &

# Wall paper
# eval `cat ~/.fehbg`
nitrogen --restore & 

# Xmodmap again
xmodmap ~/.Xmodmap

# Multiple screens
if [[ "$2" == "vga" ]] ; then
    xrandr --output LVDS --auto --primary
    xrandr --output VGA1 --auto --left-of LVDS
elif [[ "$2" == "hdmi" ]]; then
    xrandr --output LVDS --auto --output HDMI-0 --right-of LVDS #--primary
    xrandr --output LVDS --primary
elif [[ "$2" == "hdmi2" ]]; then
    xrandr --output eDP1 --auto --output HDMI1 --right-of eDP1 #--primary
    xrandr --output eDP1 --primary
else
    echo "Only one screen"
fi

## windows manager ---------------
exec $WM