if(!(Get-ScheduledTask -TaskName VSCodeContinue -ErrorAction Ignore)){
    $action = New-ScheduledTaskAction -Execute Powershell.exe -Argument '-Command "Start-Process -WindowStyle Hidden code;Unregister-ScheduledTask -TaskName VSCodeContinue -Confirm:$false;exit"'
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
    $task = New-ScheduledTask `
        -Action $action `
        -Trigger (New-ScheduledTaskTrigger -AtLogOn -User $env:USERDOMAIN\$env:USERNAME) `
        -Principal $principal
    Register-ScheduledTask -TaskName VSCodeContinue -InputObject $task | Write-Verbose
}
Restart-Computer -Force