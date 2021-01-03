# Visualizer architecture??

Figure
|- Player
|- Algorithm 1
|- Algorithm 2

in -> algorithms[]
each algorithm uses the snapshot macro
keep input state + controls + form in Player
run algorithm without hooks
useEffect to keep algorithm output in sync with inputs
return context with current active state + inputs

consumer ->
useCurrentSnapshot hook that reads into the context
no render functions, just context
