/**
 * 企业微信认证封装
 * 实现OAuth2.0认证和消息推送功能
 */

import axios from 'axios';

const WEWORK_BASE_URL = 'https://qyapi.weixin.qq.com';

export interface WeWorkUserInfo {
  userId: string;
  name: string;
  mobile?: string;
  department?: number[];
  position?: string;
  avatar?: string;
}

export class WeWorkAuth {
  private corpId: string;
  private agentId: string;
  private secret: string;
  private token: string = '';
  private tokenExpireTime: number = 0;

  constructor() {
    this.corpId = process.env.WEWORK_CORPID || '';
    this.agentId = process.env.WEWORK_AGENT_ID || '';
    this.secret = process.env.WEWORK_SECRET || '';

    if (!this.corpId || !this.agentId || !this.secret) {
      console.warn('企业微信配置不完整，请检查环境变量');
    }
  }

  /**
   * 获取access_token
   * 缓存token，避免频繁请求
   */
  private async getAccessToken(): Promise<string> {
    try {
      // 检查token是否过期（提前5分钟刷新）
      if (this.token && Date.now() < this.tokenExpireTime - 5 * 60 * 1000) {
        return this.token;
      }

      const url = `${WEWORK_BASE_URL}/cgi-bin/gettoken`;
      const response = await axios.get(url, {
        params: {
          corpid: this.corpId,
          corpsecret: this.secret,
        },
      });

      if (response.data.errcode !== 0) {
        throw new Error(`获取access_token失败: ${response.data.errmsg}`);
      }

      this.token = response.data.access_token;
      this.tokenExpireTime = Date.now() + response.data.expires_in * 1000;

      return this.token;
    } catch (error) {
      console.error('getAccessToken error:', error);
      throw error;
    }
  }

  /**
   * 根据code获取用户信息
   */
  async getUserInfo(code: string): Promise<WeWorkUserInfo> {
    try {
      const accessToken = await this.getAccessToken();

      // 1. 获取用户ID
      const userUrl = `${WEWORK_BASE_URL}/cgi-bin/user/getuserinfo`;
      const userResponse = await axios.get(userUrl, {
        params: {
          access_token: accessToken,
          code,
        },
      });

      if (userResponse.data.errcode !== 0) {
        throw new Error(`获取用户ID失败: ${userResponse.data.errmsg}`);
      }

      const userId = userResponse.data.UserId;

      // 2. 获取用户详细信息
      const detailUrl = `${WEWORK_BASE_URL}/cgi-bin/user/get`;
      const detailResponse = await axios.get(detailUrl, {
        params: {
          access_token: accessToken,
          userid: userId,
        },
      });

      if (detailResponse.data.errcode !== 0) {
        throw new Error(`获取用户详情失败: ${detailResponse.data.errmsg}`);
      }

      return {
        userId,
        name: detailResponse.data.name,
        mobile: detailResponse.data.mobile,
        department: detailResponse.data.department,
        position: detailResponse.data.position,
        avatar: detailResponse.data.avatar,
      };
    } catch (error) {
      console.error('getUserInfo error:', error);
      throw error;
    }
  }

  /**
   * 发送文本消息
   * @param userIds 用户ID列表
   * @param message 消息内容
   */
  async sendTextMessage(userIds: string[], message: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${WEWORK_BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`;

      const data = {
        touser: userIds.join('|'),
        msgtype: 'text',
        agentid: this.agentId,
        text: {
          content: message,
        },
      };

      const response = await axios.post(url, data);
      if (response.data.errcode !== 0) {
        throw new Error(`发送消息失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      console.error('sendTextMessage error:', error);
      throw error;
    }
  }

  /**
   * 发送卡片消息
   * @param userIds 用户ID列表
   * @param title 标题
   * @param description 描述
   * @param url 跳转链接
   */
  async sendCardMessage(
    userIds: string[],
    title: string,
    description: string,
    url: string
  ): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      const apiUrl = `${WEWORK_BASE_URL}/cgi-bin/message/send?access_token=${accessToken}`;

      const data = {
        touser: userIds.join('|'),
        msgtype: 'textcard',
        agentid: this.agentId,
        textcard: {
          title,
          description,
          url,
        },
      };

      const response = await axios.post(apiUrl, data);
      if (response.data.errcode !== 0) {
        throw new Error(`发送卡片消息失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      console.error('sendCardMessage error:', error);
      throw error;
    }
  }

  /**
   * 获取OAuth授权URL
   * @param redirectUri 回调地址
   * @param state 状态参数
   */
  getAuthUrl(redirectUri: string, state: string = 'STATE'): string {
    return `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${this.corpId}&agentid=${this.agentId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }
}

// 导出单例
export const weworkAuth = new WeWorkAuth();
