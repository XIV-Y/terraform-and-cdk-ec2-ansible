output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.main.id
}

output "ssm_session_command" {
  description = "SSM Session Manager connection command"
  value       = "aws ssm start-session --target ${aws_instance.main.id}"
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}
