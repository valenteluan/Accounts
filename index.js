// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ]
    }])
        .then(answer => {
            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Consultar Saldo') {

            } else if (action === 'Depositar') {

            } else if (action === 'Sacar') {

            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
                process.exit()
            }

        })
        .catch(err => console.log(err))
}

// Criando conta

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accoutName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then(answer => {
        const accoutName = answer['accoutName']

        console.info(accoutName)

        // Verificar se o banco de dados existe e se não existir criar

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        // Verifica se o nome da conta já existe
        if (fs.existsSync(`accounts/${accoutName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        // Cria a conta
        fs.writeFileSync(`accounts/${accoutName}.json`,
            '{"balancte": 0}',
            function (err) {
                console.log(err)
            })

        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()

    }).catch(err => console.log(err))


}



