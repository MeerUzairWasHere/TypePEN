// services/email.service.ts
import { createTransport } from "nodemailer";
import {
  CompanyInfo,
  EmailOptions,
  ResetPasswordEmailParams,
  VerificationEmailParams,
  WelcomeEmailParams,
  IEmailService,
} from "../types/email.types";
import { CompanyService } from "./company.service";

export class EmailService implements IEmailService {
  private transporter: any;
  private company: CompanyInfo | null = null;

  constructor(nodemailerConfig: any, private companyService?: CompanyService) {
    this.transporter = createTransport(nodemailerConfig);

    // Auto-load company if provided
    if (companyService) {
      this.loadCompany(companyService);
    }
  }

  public async loadCompany(companyService: CompanyService): Promise<void> {
    this.company = await companyService.getCompany();
  }

  private async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    if (!this.company) {
      throw new Error("Company info not loaded. Call loadCompany() first.");
    }

    const mailOptions = {
      from: `${this.company.name} <${this.company.email}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  public async sendResetPasswordEmail({
    name,
    email,
    token,
    origin,
    expirationHours = 1,
  }: ResetPasswordEmailParams): Promise<void> {
    if (!this.company) {
      throw new Error("Company info not loaded. Call loadCompany() first.");
    }

    const resetURL = `${origin}/reset-password?token=${token}&email=${email}`;

    const html = `<div style="background-color: #ffffff; padding: 24px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #7e22ce;">Password Reset Request</h1>
    </div>
    
    <!-- Body -->
    <div style="margin-bottom: 32px; text-align: center;">
      <p style="color: #1f2937; margin-bottom: 24px;">Hello <strong>${name}</strong>, we received a request to reset your password. Click the button below to set a new password:</p>
      
      <a href="${resetURL}" style="display: block; width: 80%; max-width: 320px; margin-left: auto; margin-right: auto; background-color: #9333ea; transition: background-color 300ms; color: #ffffff; font-weight: 500; padding: 12px 24px; border-radius: 6px; text-align: center; margin-bottom: 24px; text-decoration: none;">
        Reset Password
      </a>
      
      <p style="color: #4b5563; font-size: 14px;">
        Or paste this link into your browser:
        <br>
        <a href="${resetURL}" style="color: #9333ea; word-break: break-all; text-decoration: underline;">${resetURL}</a>
      </p>
      
      <div style="margin-top: 32px; color: #4b5563; font-size: 14px;">
        <p>This link will expire in ${expirationHours} hour${
      expirationHours !== 1 ? "s" : ""
    } for security reasons.</p>
        <p style="margin-top: 16px;">If you didn't request a password reset, please ignore this email or contact support.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
      <div style="color: #6b7280; font-size: 14px;">
        <p>${this.company.name}</p>
        <p style="margin-top: 8px;">Need help? <a href="mailto:${
          this.company.email
        }" style="color: #9333ea; text-decoration: underline;">Contact support</a></p>
      </div>
    </div>
  </div>`;

    await this.sendEmail({
      to: email,
      subject: `${this.company.name} Password Reset Request`,
      html,
    });
  }

  public async sendVerificationEmail({
    name,
    email,
    verificationToken,
    origin,
    expirationHours = 24,
  }: VerificationEmailParams): Promise<void> {
    if (!this.company) {
      throw new Error("Company info not loaded. Call loadCompany() first.");
    }

    const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;

    const html = `<div style="background-color: #ffffff; padding: 24px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #7e22ce;">Welcome to ${this.company.name}!</h1>
    </div>
    
    <!-- Body -->
    <div style="margin-bottom: 32px; text-align: center;">
      <p style="color: #1f2937; margin-bottom: 24px;">Thank you for signing up, <strong>${name}</strong>! Click below to confirm your account:</p>
      
      <a href="${verifyEmail}" style="display: block; width: 80%; max-width: 320px; margin-left: auto; margin-right: auto; background-color: #9333ea; transition: background-color 300ms; color: #ffffff; font-weight: 500; padding: 12px 24px; border-radius: 6px; text-align: center; margin-bottom: 24px; text-decoration: none;">
        Verify Email
      </a>
      
      <p style="color: #4b5563; font-size: 14px;">
        Or paste this link into your browser:
        <br>
        <a href="${verifyEmail}" style="color: #9333ea; word-break: break-all; text-decoration: underline;">${verifyEmail}</a>
      </p>
      
      <div style="margin-top: 32px; color: #4b5563; font-size: 14px;">
        <p>This link will expire in ${expirationHours} hours.</p>
        <p style="margin-top: 16px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
      <div style="color: #6b7280; font-size: 14px;">
        <p>${this.company.name}</p>
        <p style="margin-top: 8px;">Contact us: <a href="mailto:${this.company.email}" style="color: #9333ea; text-decoration: underline;">${this.company.email}</a></p>
      </div>
    </div>
  </div>`;

    await this.sendEmail({
      to: email,
      subject: `${this.company.name} Email Verification`,
      html,
    });
  }

  public async sendWelcomeEmail({
    name,
    email,
  }: WelcomeEmailParams): Promise<void> {
    if (!this.company) {
      throw new Error("Company info not loaded. Call loadCompany() first.");
    }

    const websiteUrl = this.company.website;
    const address = this.company.address;

    const html = `<div style="background-color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Header with gradient background -->
      <div style="background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); padding: 32px; text-align: center;">
        <h1 style="font-size: 28px; font-weight: 700; color: white; margin-bottom: 8px;">Welcome to ${
          this.company.name
        }!</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px;">We're thrilled to have you on board, ${name}!</p>
      </div>
      
      <!-- Main content -->
      <div style="padding: 24px;">
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining ${
            this.company.name
          }. We're excited to have you as part of our community.
        </p>
        
        <!-- Getting started section -->
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 16px;">Getting Started</h2>
          <div style="display: flex; margin-bottom: 12px;">
            <div style="background-color: #9333ea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; flex-shrink: 0;">1</div>
            <p style="color: #4b5563; margin: 0;">Complete your profile to personalize your experience</p>
          </div>
          <div style="display: flex; margin-bottom: 12px;">
            <div style="background-color: #9333ea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; flex-shrink: 0;">2</div>
            <p style="color: #4b5563; margin: 0;">Explore our platform and discover all the features</p>
          </div>
          <div style="display: flex;">
            <div style="background-color: #9333ea; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px; flex-shrink: 0;">3</div>
            <p style="color: #4b5563; margin: 0;">Reach out if you have any questions or need assistance</p>
          </div>
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${websiteUrl}" style="display: inline-block; background-color: #9333ea; color: white; font-weight: 600; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px;">Get Started</a>
        </div>
        
        <!-- Help section -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
          <h3 style="font-size: 18px; color: #1f2937; margin-bottom: 12px;">Need help?</h3>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 8px;">
            Our customer support team is here to assist you with any questions you may have.
          </p>
          <a href="mailto:${
            this.company.email
          }" style="color: #9333ea; text-decoration: none; font-weight: 500;">Contact Support</a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280;">
        <p style="margin-bottom: 16px;">
          You're receiving this email because you signed up for an account on ${
            this.company.name
          }.
        </p>
        <p style="margin-bottom: 16px;">
          &copy; ${new Date().getFullYear()} ${
      this.company.name
    }. All rights reserved.<br>
          ${address}
        </p>
      </div>
    </div>`;

    await this.sendEmail({
      to: email,
      subject: `Welcome to ${this.company.name}, ${name}!`,
      html,
    });
  }
}
