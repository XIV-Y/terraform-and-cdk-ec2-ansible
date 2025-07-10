# AWS CDK or Terraform + Ansible EC2 Setup

AWS CDK or Terraform でPrivate SubnetにEC2を配置し、SSM経由でAnsibleを使用して環境構築を行う。

<img width="1071" height="959" alt="名称未設定ファイル drawio (5)" src="https://github.com/user-attachments/assets/f0b3fb8f-d10e-42e8-9b1b-8d6c18b634d5" />

## 前提条件

- AWS CDK
  - AWS CLIが設定済みであること
  - AWS CDKがインストール済みであること
 
- Terraform
  - Terraformがインストール済みであること

## 手順

### 1. AWSリソースのデプロイ

AWS
```bash
npm install
npx cdk deploy
```

Terraform
```bash
terraform init

# 必要に応じて
terraform plan 

terraform apply
```

デプロイ完了後、インスタンスIDを確認する：
```
Outputs:
Ec2PrivateSubnetCdkStack.InstanceId = i-xxxxxxxxxx
Ec2PrivateSubnetCdkStack.SSMSessionCommand = aws ssm start-session --target i-xxxxxxxxxx
```

### 2. Ansibleファイルの送信

#### プレイブックファイルの送信
```bash
PLAYBOOK_CONTENT=$(base64 -w 0 ansible/playbook.yml)
aws ssm send-command \
    --instance-ids "i-xxxxxxxxxx" \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[\"echo '$PLAYBOOK_CONTENT' | base64 -d > /tmp/playbook.yml\"]"
```

#### 設定ファイルの送信
```bash
CONFIG_CONTENT=$(base64 -w 0 ansible/ansible.cfg)
aws ssm send-command \
    --instance-ids "i-xxxxxxxxxx" \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[\"echo '$CONFIG_CONTENT' | base64 -d > /tmp/ansible.cfg\"]"
```

#### インベントリファイルの送信
```bash
INVENTORY_CONTENT=$(base64 -w 0 ansible/inventory.ini)
aws ssm send-command \
    --instance-ids "i-xxxxxxxxxx" \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[\"echo '$INVENTORY_CONTENT' | base64 -d > /tmp/inventory.ini\"]"
```

### 3. EC2インスタンスに接続

```bash
aws ssm start-session --target i-xxxxxxxxxx
```

### 4. Ansible実行とテスト

#### 初期状態確認
```bash
# SLコマンドがないことを確認
sl
# command not found が表示されることを確認
```

#### Ansibleファイル確認
```bash
cd /tmp
ls -la
# ansible系ファイルがあることを確認
```

#### Ansibleプレイブック実行
```bash
ansible-playbook -c local playbook.yml
```

#### 結果確認
```bash
# SLコマンドが実行できることを確認
sl
```

### 5. 動作確認

- `/opt/myapp/` ディレクトリが作成されていることを確認
- 設定ファイルとスクリプトが配置されていることを確認
- systemdサービスが有効になっていることを確認

```bash
ls -la /opt/myapp/
cat /opt/myapp/config.conf
sudo systemctl status myapp-demo
```
