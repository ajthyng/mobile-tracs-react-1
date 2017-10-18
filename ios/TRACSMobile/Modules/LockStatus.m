//
//  LockStatus.m
//  TRACSMobile
//
//  Created by Andrew Thyng on 10/18/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
#import "LockStatus.h"
#import <React/RCTLog.h>
#import <LocalAuthentication/LocalAuthentication.h>

@implementation LockStatus

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(isDeviceSecure, isDeviceSecureWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  LAContext* context = [[LAContext alloc] init];
  NSArray* secured;
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:nil]) {
    secured = @[@"true"];
  } else {
    secured = @[@"false"];
  }
  resolve(secured);
}
@end
