// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

const runCommandOnNextActivation = 'restart-computer.runCommandOnNextActivation';
const runTaskOnNextActivation = 'restart-computer.runTaskOnNextActivation';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let setRunCommandForNextActivation = (command: string) => context.globalState.update(runCommandOnNextActivation,command);

	let restartComputer = vscode.commands.registerCommand('restart-computer.restartComputer', async (continuationCommand) => {
		if(continuationCommand){
			if(continuationCommand.length && continuationCommand.length === 2){
				let regexresult = /\${command:restart-computer\.restartComputer:([^}]+)}/.exec(continuationCommand[0]);
				if(regexresult && regexresult[1]){
					await setRunCommandForNextActivation(regexresult[1]); //provide task command calls like ${command:restart-computer.restartComputer:audioCues.help}
				}else{
					throw new Error("Unknown input format");
				}
			}else{
				await setRunCommandForNextActivation(continuationCommand);
			}
		}
		if(process.platform==='win32'){
			exec(`"Powershell.exe" -File ${context.extensionPath}/assets/Restart.ps1`);
		}else{
			throw new Error("Not implemented");
		}
	});
	context.subscriptions.push(restartComputer);

	//if restart-computer.runCommandOnNextActivation exists, run it and clear
	let runcmd = context.globalState.get<string>(runCommandOnNextActivation);
	if(runcmd){
		let command = runcmd;
		setRunCommandForNextActivation("").then(()=>{
			let regexresult = /workbench.action.tasks.runTask:(.*)/.exec(command);
			if(regexresult && regexresult[1]){
				vscode.commands.executeCommand('workbench.action.tasks.runTask',regexresult[1]);
			}else{
				vscode.commands.executeCommand(command);
			}
		});
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
