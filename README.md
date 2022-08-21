# CTLog Viewer

Open, parse and display CTLogs for easy review and analysis.

From standard CT format:
```xml
<BusCode>
time=08/18/2022 15:55:41.429
method=Invoke propGet_BootstrapTimestamp com.myapp.mymodule.core.BootstrapControl [3]
parent=Run com/myapp/mymodule/core/BootstrapChecker.p  [2]
START
In:
</BusCode>

<BusCode>
time=08/18/2022 15:55:41.430
method=Invoke propGet_BootstrapTimestamp com.myapp.mymodule.core.BootstrapControl [3]
parent=Run com/myapp/mymodule/core/BootstrapChecker.p  [2]
duration=1
END
Out:08/18/2022 17:21:23.966-04:00
</BusCode>
```
To user friendly GUI:  
(TODO add screenshot)

## Features

* Display call parameters (input and output) next to the call; also in a tooltip on mouse hover.
* Filter out calls with runtimes under configurable threshold
* Highlight long running calls
* Runs locally and offline; no need to upload anything anywhere
